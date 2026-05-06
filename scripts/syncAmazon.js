import { db } from "../firebase-config";
import { collection, doc, setDoc } from "firebase/firestore";

const SERPAPI_KEY = process.env.SERPAPI_KEY;

async function fetchAmazonProducts() {
  const res = await fetch(
    `https://serpapi.com/search.json?engine=amazon&q=smart watch&api_key=${SERPAPI_KEY}`
  );

  const data = await res.json();
  return data.organic_results || [];
}

async function syncToFirestore() {
  try {
    const products = await fetchAmazonProducts();

    for (const p of products) {
      if (!p.asin) continue;

      const ref = doc(db, "products", p.asin);

      await setDoc(ref, {
        asin: p.asin,
        title: p.title || "No Title",
        image: p.thumbnail || "",
        price: p.price || 0,
        link: p.link || "",
        category: "electronics",

        clicks: 0,
        orders: 0,

        updatedAt: Date.now(),
      });
    }

    console.log("🔥 Auto Sync Done Successfully");
  } catch (err) {
    console.error("Sync Error:", err);
  }
}

syncToFirestore();
