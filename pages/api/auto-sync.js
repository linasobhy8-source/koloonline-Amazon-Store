import { db } from "../../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
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

    // 🔥 جلب المنتجات الموجودة لمنع التكرار
    const existingSnap = await getDocs(collection(db, "products"));
    const existingTitles = new Set(
      existingSnap.docs.map((d) => d.data().title)
    );

    let saved = 0;

    for (const item of results) {
      if (!item.title || existingTitles.has(item.title)) continue;

      // 🧠 AI FILTERING (تنظيف بسيط)
      if (item.title.length < 10) continue;
      if (!item.price && !item.extracted_price) continue;

      const price = Number(item.price || item.extracted_price || 0);

      // ❌ فلترة المنتجات الضعيفة
      if (price <= 0 || price > 5000) continue;

      // ⭐ Ranking Score (Amazon Style)
      const score =
        (item.rating || 3) * 2 +
        Math.min(item.reviews || 0, 1000) / 500 +
        (price < 50 ? 2 : 1);

      await addDoc(collection(db, "products"), {
        title: item.title,
        image: item.thumbnail || "",
        price: price,
        link: item.link,
        rating: item.rating || 0,
        reviews: item.reviews || 0,
        score,
        category: keyword,
        createdAt: serverTimestamp(),
        clicks: 0,
        orders: 0,
      });

      saved++;
    }

    return res.status(200).json({
      success: true,
      saved,
      total: results.length,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
