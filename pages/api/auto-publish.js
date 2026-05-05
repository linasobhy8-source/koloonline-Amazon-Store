import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= TRENDING KEYWORDS ================= */
const keywordsPool = [
  "best wireless earbuds 2026",
  "cheap smart watch for fitness",
  "amazon deals today",
  "home gadgets must have",
  "top amazon products review",
  "budget tech gadgets",
];

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    /* 🔥 pick random keyword */
    const keyword =
      keywordsPool[Math.floor(Math.random() * keywordsPool.length)];

    /* ================= CALL AI ================= */
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `اكتب مقال SEO احترافي عن: ${keyword} مع أسلوب تسويقي`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const article =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!article) {
      return res.status(500).json({ error: "AI failed" });
    }

    /* ================= SAVE BLOG ================= */
    const blogRef = await addDoc(collection(db, "blog"), {
      title: keyword,
      content: article,
      auto: true,
      createdAt: serverTimestamp(),
    });

    /* ================= LOG ================= */
    await addDoc(collection(db, "cron_logs"), {
      type: "auto_publish",
      keyword,
      blogId: blogRef.id,
      status: "success",
      createdAt: serverTimestamp(),
    });

    /* ================= GOOGLE PING ================= */
    await fetch(
      `https://www.google.com/ping?sitemap=https://koloonline.online/api/sitemap`
    );

    return res.status(200).json({
      success: true,
      keyword,
      blogId: blogRef.id,
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Auto publish failed" });
  }
}
