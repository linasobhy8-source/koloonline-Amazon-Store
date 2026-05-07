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

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    /* ================= METHOD CHECK ================= */
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    /* ================= BODY ================= */
    const { keyword } = req.body || {};

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        error: "keyword is required",
      });
    }

    /* ================= GEMINI REQUEST ================= */
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
اكتب مقال SEO احترافي قوي جدًا عن: ${keyword}

الشروط:
- عنوان جذاب H1
- مقدمة قوية
- 5 عناوين H2 على الأقل
- شرح مفصل
- Bullet Points
- SEO قوي
- أسلوب تسويقي
- خاتمة احترافية
- حوالي 1000 كلمة
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    /* ================= GEMINI RESPONSE ================= */
    const data = await response.json();

    let text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    text = String(text);

    if (!text || text.length < 100) {
      await addDoc(collection(db, "cron_logs"), {
        type: "auto_blog",
        status: "error",
        message: "Empty AI response",
        keyword: String(keyword),
        createdAt: serverTimestamp(),
      });

      return res.status(500).json({
        error: "Empty AI response",
      });
    }

    /* ================= GET PRODUCTS ================= */
    const productsSnap = await getDocs(
      collection(db, "products")
    );

    const products = productsSnap.docs.map((d) => ({
      id: String(d.id),
      ...d.data(),
    }));

    /* ================= SMART MATCHING ================= */
    const keywords = String(keyword)
      .toLowerCase()
      .split(" ");

    const relatedProducts = products
      .filter((p) => p && p.id && p.title)
      .map((p) => {
        let score = 0;

        keywords.forEach((k) => {
          if (
            p.title?.toLowerCase()?.includes(k)
          ) {
            score += 5;
          }

          if (
            p.category?.toLowerCase()?.includes(k)
          ) {
            score += 3;
          }
        });

        return {
          id: String(p.id),
          title: String(p.title || ""),
          category: String(p.category || ""),
          link: String(p.link || ""),
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    /* ================= INTERNAL LINKS ================= */
    relatedProducts.forEach((p) => {
      try {
        if (p.title && p.id) {
          const link = `https://koloonline.online/product/${p.id}`;

          const firstWord = p.title
            .split(" ")[0]
            ?.trim();

          if (!firstWord) return;

          const regex = new RegExp(firstWord, "gi");

          text = text.replace(
            regex,
            `<a href="${link}" style="color:#ff9900;font-weight:bold">${p.title}</a>`
          );
        }
      } catch (err) {
        console.log("Link Error:", err.message);
      }
    });

    /* ================= SAVE BLOG ================= */
    const blogRef = await addDoc(
      collection(db, "blog"),
      {
        title: String(keyword),
        slug: String(keyword)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),

        content: String(text),

        auto: true,
        seo: true,

        relatedProducts: relatedProducts.map(
          (p) => String(p.id)
        ),

        createdAt: serverTimestamp(),
      }
    );

    /* ================= SUCCESS LOG ================= */
    await addDoc(collection(db, "cron_logs"), {
      type: "auto_blog",
      status: "success",
      message: "Blog generated successfully",
      keyword: String(keyword),
      blogId: String(blogRef.id),
      createdAt: serverTimestamp(),
    });

    /* ================= AUTO INDEX ================= */
    try {
      await fetch(
        "https://koloonline.online/api/master-pipeline",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "blog",
            id: blogRef.id,
          }),
        }
      );
    } catch (e) {
      console.log("Pipeline Error:", e.message);
    }

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      article: text,
      keyword,
      blogId: blogRef.id,
      relatedProducts,
    });

  } catch (e) {
    console.error("AI ERROR:", e);

    /* ================= ERROR LOG ================= */
    try {
      await addDoc(collection(db, "cron_logs"), {
        type: "auto_blog",
        status: "error",
        message: String(
          e?.message || "Unknown error"
        ),
        createdAt: serverTimestamp(),
      });
    } catch (logErr) {
      console.log("LOG ERROR:", logErr.message);
    }

    return res.status(500).json({
      error: "AI generation failed",
      details: String(e?.message || ""),
    });
  }
                     }
