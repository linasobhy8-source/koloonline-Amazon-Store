import { db } from "../../firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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

    for (const item of results) {
      if (!item.title) continue;

      await addDoc(collection(db, "products"), {
        title: item.title,
        image: item.thumbnail || "",
        price: item.price || 0,
        link: item.link || "",
        source: "serpapi",
        createdAt: serverTimestamp(),
        clicks: 0,
        orders: 0,
      });

      saved++;
    }

    return res.status(200).json({
      success: true,
      message: "Sync completed",
      saved,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
