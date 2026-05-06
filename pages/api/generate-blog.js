import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: "keyword is required" });
    }

    /* ================= GEMINI REQUEST ================= */
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
- مقدمة قوية لا تقل عن 80 كلمة
- 5 عناوين H2 على الأقل
- شرح مفصل لكل قسم
- نقاط Bullet points
- كلمات شرائية (Buy now, best price, discount, offer)
- أسلوب تسويقي للأفلييت
- تحسين لمحركات البحث SEO
- خاتمة فيها دعوة للشراء
- طول المقال حوالي 1000 كلمة
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    let text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      await addDoc(collection(db, "cron_logs"), {
        type: "auto_blog",
        status: "error",
        message: "Empty AI response",
        keyword,
        createdAt: serverTimestamp(),
      });

      return res.status(500).json({ error: "Empty AI response" });
    }

    /* ================= GET PRODUCTS ================= */
    const productsSnap = await getDocs(collection(db, "products"));

    const products = productsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= SMART MATCHING ================= */
    const keywords = keyword.toLowerCase().split(" ");

    const relatedProducts = products
      .map((p) => {
        let score = 0;

        keywords.forEach((k) => {
          if (p.title?.toLowerCase().includes(k)) score += 5;
          if (p.category?.toLowerCase().includes(k)) score += 3;
        });

        return { ...p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    /* ================= INTERNAL LINKS ================= */
    relatedProducts.forEach((p) => {
      if (p.title) {
        const link = `https://koloonline.online/product/${p.id}`;
        const firstWord = p.title.split(" ")[0];

        const regex = new RegExp(firstWord, "gi");

        text = text.replace(
          regex,
          `<a href="${link}" style="color:#ff9900;font-weight:bold">${p.title}</a>`
        );
      }
    });

    /* ================= SAVE BLOG ================= */
    const blogRef = await addDoc(collection(db, "blog"), {
      title: keyword,
      content: text,
      auto: true,
      seo: true,
      relatedProducts: relatedProducts.map((p) => p.id),
      createdAt: serverTimestamp(),
    });

    /* ================= LOG SUCCESS ================= */
    await addDoc(collection(db, "cron_logs"), {
      type: "auto_blog",
      status: "success",
      message: "Blog generated with smart linking",
      keyword,
      blogId: blogRef.id,
      createdAt: serverTimestamp(),
    });

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      article: text,
      blogId: blogRef.id,
      relatedProducts,
      keyword,
    });

  } catch (e) {
    console.error("AI ERROR:", e);

    await addDoc(collection(db, "cron_logs"), {
      type: "auto_blog",
      status: "error",
      message: e.message,
      createdAt: serverTimestamp(),
    });

    return res.status(500).json({
      error: "AI generation failed",
    });
  }
  }
