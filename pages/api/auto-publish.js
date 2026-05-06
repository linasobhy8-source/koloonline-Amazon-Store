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
    console.log("🔥 AUTO PUBLISH STARTED");

    /* 🔥 pick random keyword */
    const keyword =
      keywordsPool[Math.floor(Math.random() * keywordsPool.length)];

    console.log("🔎 Keyword:", keyword);

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
                  text: `
اكتب مقال SEO احترافي قوي جدًا عن: ${keyword}

الشروط:
- عنوان جذاب (H1)
- مقدمة قوية
- 5 عناوين H2 على الأقل
- شرح مفصل لكل قسم
- Bullet points
- أسلوب تسويقي (Affiliate)
- كلمات شرائية (Buy, Best, Discount)
- CTA في النهاية
- طول المقال 800 - 1200 كلمة
                  `,
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
      throw new Error("AI failed");
    }

    /* ================= SAVE BLOG ================= */
    const blogRef = await addDoc(collection(db, "blog"), {
      title: keyword,
      content: article,
      auto: true,
      createdAt: serverTimestamp(),
    });

    console.log("📝 Blog saved:", blogRef.id);

    /* ================= LOG SUCCESS ================= */
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

    /* ================= 🚀 AUTO DEPLOY ================= */
    await fetch(
      "https://api.vercel.com/v1/integrations/deploy/prj_mdjWXds5yhbCwPLFVfTJ8fd0XX0u/pWmuibqosg"
    );

    console.log("🚀 Deploy triggered");

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      keyword,
      blogId: blogRef.id,
    });

  } catch (e) {
    console.error("❌ AUTO PUBLISH ERROR:", e);

    /* ================= LOG ERROR ================= */
    await addDoc(collection(db, "cron_logs"), {
      type: "auto_publish",
      status: "error",
      message: e.message,
      createdAt: serverTimestamp(),
    });

    return res.status(500).json({
      error: "Auto publish failed",
    });
  }
}
