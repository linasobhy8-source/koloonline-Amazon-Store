import {
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";

import { db } from "../config/firebase";

/* ================= CACHE ================= */
let cache = null;
let lastFetch = 0;

const CACHE_TIME = 1000 * 60 * 30; // 30 minutes

/* ================= SAFE STRING ================= */
function safeString(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

/* ================= SAFE NUMBER ================= */
function safeNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

/* ================= GET PRODUCTS ================= */
export async function getProductsFast() {
  const now = Date.now();

  if (
    cache &&
    now - lastFetch < CACHE_TIME
  ) {
    return cache;
  }

  try {
    const q = query(
      collection(db, "products"),
      limit(80)
    );

    const snap = await getDocs(q);

    const data = snap.docs.map((doc) => {
      const item = doc.data() || {};

      return {
        id: safeString(doc.id),

        title: safeString(item.title),
        description: safeString(item.description),

        image: safeString(item.image),
        link: safeString(item.link),

        category: safeString(item.category),

        price: safeNumber(item.price),

        score: safeNumber(
          item.score || item.rating
        ),

        views: safeNumber(item.views),

        clicks: safeNumber(item.clicks),

        viralBoost: Boolean(
          item.viralBoost ||
          item["viral boost"] ||
          item["تعزيز الانتشار الفيروسي"]
        ),
      };
    });

    cache = data;
    lastFetch = now;

    console.log(
      `Loaded ${data.length} products`
    );

    return data;
  } catch (error) {
    console.error(
      "getProductsFast error:",
      error
    );

    return [];
  }
}
