import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
  limit,
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

/* ================= SLUG ================= */
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ================= SAFE TEXT ================= */
function cleanText(text) {
  return String(text)
    .replace(/```/g, "")
    .replace(/\n{3,}/g, "\n\n");
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { keyword } = req.body || {};
    if (!keyword) {
      return res.status(400).json({ error: "keyword required" });
    }

    const slug = createSlug(keyword);

    /* ================= CHECK DUPLICATE BLOG ================= */
    const existing = await getDocs(
      query(collection(db, "blog"), where("slug", "==", slug), limit(1))
    );

    if (!existing.empty) {
      return res.status(409).json({
        error: "Blog already exists",
        slug,
      });
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
اكتب مقال SEO احترافي عن: ${keyword}

الشروط:
- عنوان H1 جذاب
- وصف Meta جاهز
- 5 عناوين H2
- مقدمة قوية
- 1000 كلمة
- كلمات تسويقية
- FAQ في النهاية
- أسلوب مناسب لأدسنس
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
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text || text.length < 100) {
      return res.status(500).json({ error: "Empty AI response" });
    }

    text = cleanText(text);

    /* ================= PRODUCTS ================= */
    const productsSnap = await getDocs(collection(db, "products"));

    const products = productsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const keywords = keyword.toLowerCase().split(" ");

    const relatedProducts = products
      .map((p) => {
        let score = 0;

        keywords.forEach((k) => {
          if (p.title?.toLowerCase().includes(k)) score += 5;
          if (p.category?.toLowerCase().includes(k)) score += 3;
        });

        return {
          id: p.id,
          title: p.title,
          link: p.link,
          score,
        };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    /* ================= SMART LINKING ================= */
    relatedProducts.forEach((p) => {
      const word = p.title.split(" ")[0];

      if (word) {
        const regex = new RegExp(word, "gi");

        text = text.replace(
          regex,
          `<a href="https://koloonline.online/product/${p.id}" style="color:#ff9900;font-weight:bold">${word}</a>`
        );
      }
    });

    /* ================= SEO FIELDS ================= */
    const seoTitle = `${keyword} - Best Amazon Deals 2026`;
    const seoDesc = text.slice(0, 150);

    /* ================= SAVE BLOG ================= */
    const blogRef = await addDoc(collection(db, "blog"), {
      title: keyword,
      seoTitle,
      seoDesc,
      slug,
      content: text,
      auto: true,
      seo: true,
      tags: keywords,
      relatedProducts: relatedProducts.map((p) => p.id),
      createdAt: serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      blogId: blogRef.id,
      slug,
      relatedProducts,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
      }
