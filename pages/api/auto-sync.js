import { db } from "../../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const keyword = req.query.q || "amazon deals";
    const apiKey = process.env.SERPAPI_KEY;

    const url = `https://serpapi.com/search.json?engine=amazon&q=${encodeURIComponent(
      keyword
    )}&api_key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data?.organic_results || [];

    /* ================= EXISTING PRODUCTS ================= */
    const existingSnap = await getDocs(collection(db, "products"));

    const existingTitles = new Set(
      existingSnap.docs.map((d) =>
        d.data().title?.toLowerCase().trim()
      )
    );

    let saved = 0;

    for (const item of results) {
      if (!item.title) continue;

      const title = item.title.toLowerCase().trim();

      /* ================= DUPLICATE PREVENTION ================= */
      if (existingTitles.has(title)) continue;

      /* ================= AI FILTERING ================= */
      if (title.length < 10) continue;

      const price = Number(item.price || item.extracted_price || 0);

      if (!price || price <= 0 || price > 5000) continue;

      const rating = Number(item.rating || 3);
      const reviews = Number(item.reviews || 0);

      /* ================= SMART SCORE (Amazon Style AI) ================= */
      const score =
        rating * 2 +
        Math.min(reviews, 2000) / 400 +
        (price < 50 ? 3 : 1) +
        (price < 20 ? 2 : 0);

      await addDoc(collection(db, "products"), {
        title: item.title,
        image: item.thumbnail || "",
        price,
        link: item.link || "",
        rating,
        reviews,
        score,

        category: keyword,

        createdAt: serverTimestamp(),

        /* Analytics base */
        clicks: 0,
        orders: 0,
      });

      saved++;
    }

    return res.status(200).json({
      success: true,
      keyword,
      saved,
      total: results.length,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
         }
