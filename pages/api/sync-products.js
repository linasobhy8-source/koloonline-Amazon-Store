import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.SERPAPI_KEY;
    const keyword = req.query.q || "amazon deals";

    const url = `https://serpapi.com/search.json?engine=amazon&q=${encodeURIComponent(
      keyword
    )}&api_key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data?.organic_results || [];

    let saved = 0;
    let skipped = 0;

    /* ================= EXISTING ================= */
    const existingSnap = await getDocs(collection(db, "products"));

    const existingLinks = new Set(
      existingSnap.docs.map((d) => d.data().link)
    );

    for (const item of results) {
      if (!item.title || !item.link) continue;

      /* ================= DUPLICATE ================= */
      if (existingLinks.has(item.link)) {
        skipped++;
        continue;
      }

      /* ================= CLEAN PRICE ================= */
      let price = 0;
      if (item.price) {
        price = parseFloat(
          item.price.replace(/[^0-9.]/g, "")
        ) || 0;
      }

      /* ================= FILTER (AI-like) ================= */
      if (price === 0 || !item.thumbnail) {
        skipped++;
        continue;
      }

      /* ================= AFFILIATE ================= */
      const tag = process.env.AMAZON_US || "koloonlinesto-20";
      const affiliateLink = `${item.link}?tag=${tag}`;

      /* ================= SMART SCORE ================= */
      const score =
        (price < 50 ? 3 : 1) +
        Math.random() * 3;

      /* ================= SAVE ================= */
      await addDoc(collection(db, "products"), {
        title: item.title,
        image: item.thumbnail,
        price,
        link: affiliateLink,
        source: "serpapi",
        createdAt: serverTimestamp(),

        clicks: 0,
        orders: 0,
        score,
      });

      saved++;
    }

    return res.status(200).json({
      success: true,
      message: "🔥 Auto Sync PRO completed",
      saved,
      skipped,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
