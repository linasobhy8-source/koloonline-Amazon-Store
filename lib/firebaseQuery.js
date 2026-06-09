import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

let cache = null;
let lastFetch = 0;

const CACHE_TIME = 1000 * 60 * 30;

export async function getProductsFast() {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_TIME) {
    return cache;
  }

  try {
    const snap = await getDocs(
      collection(db, "products")
    );

    const data = snap.docs.map((doc) => {
      const item = doc.data() || {};

      return {
        id: String(doc.id || ""),
        title: item.title || "",
        description: item.description || "",
        image: item.image || "",
        link: item.link || "",
        category: item.category || "",
        price: Number(item.price || 0),
        score: Number(item.score || item.rating || 0),
        views: Number(item.views || 0),
        clicks: Number(item.clicks || 0),
      };
    });

    cache = data;
    lastFetch = now;

    return data;
  } catch (e) {
    console.error("❌ getProductsFast error:", e);
    return [];
  }
}
