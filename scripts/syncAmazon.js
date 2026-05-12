import { db } from "../firebase-config";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

const SERPAPI_KEY = process.env.SERPAPI_KEY;

async function fetchAmazonProducts() {
  const res = await fetch(
    `https://serpapi.com/search.json?engine=amazon&q=smart watch&api_key=${SERPAPI_KEY}`
  );

  const data = await res.json();
  return data.organic_results || [];
}

/* ================= CLEAN SYNC ================= */
async function syncToFirestore() {
  try {
    const products = await fetchAmazonProducts();

    for (const p of products) {
      if (!p.asin) continue;

      const ref = doc(db, "products", p.asin);

      /* ================= CHECK DUPLICATE ================= */
      const existing = await getDoc(ref);

      const newData = {
        asin: p.asin,
        title: (p.title || "No Title").trim(),
        image: p.thumbnail || "",
        price: p.price || 0,
        link: p.link || "",
        category: "electronics",

        clicks: existing.exists() ? existing.data().clicks || 0 : 0,
        orders: existing.exists() ? existing.data().orders || 0 : 0,

        updatedAt: Date.now(),
      };

      /* ================= WRITE ONLY IF NEW OR CHANGED ================= */
      if (!existing.exists()) {
        await setDoc(ref, newData);
        console.log("🆕 New product added:", p.asin);
      } else {
        await setDoc(ref, newData, { merge: true });
        console.log("♻️ Updated product:", p.asin);
      }
    }

    console.log("🔥 Auto Sync Done Successfully");
  } catch (err) {
    console.error("Sync Error:", err);
  }
}

syncToFirestore();
