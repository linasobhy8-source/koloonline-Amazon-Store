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

    /* ================= GET EXISTING PRODUCTS ================= */
    const existingSnap = await getDocs(collection(db, "products"));

    const existingTitles = new Set(
      existingSnap.docs.map((d) => d.data().title)
    );

    for (const item of results) {
      if (!item.title) continue;

      /* ================= DUPLICATE PREVENTION ================= */
      if (existingTitles.has(item.title)) {
        skipped++;
        continue;
      }

      /* ================= SAVE TO FIRESTORE ================= */
      await addDoc(collection(db, "products"), {
        title: item.title,
        image: item.thumbnail || "",
        price: parseFloat(item.price?.replace("$", "")) || 0,
        link: item.link || "",
        source: "serpapi",
        createdAt: serverTimestamp(),

        /* Analytics base */
        clicks: 0,
        orders: 0,

        /* Smart ranking base */
        score: Math.random() * 5 + 3,
      });

      saved++;
    }

    return res.status(200).json({
      success: true,
      message: "Auto Sync completed",
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
