import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= CACHE ================= */
let cache = null;
let lastFetch = 0;

const CACHE_TIME = 1000 * 60 * 30; // 30 min

/* ================= SAFE HELPERS ================= */
const safeString = (v) => {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return String(v);

  if (Array.isArray(v)) {
    return v.map(safeString).join(" ");
  }

  if (typeof v === "object" && v !== null) {
    return v?.text || v?.value || v?.title || "";
  }

  return "";
};

const safeNumber = (v) => {
  const num = Number(v);
  return Number.isFinite(num) ? num : 0;
};

const safeBoolean = (v) => {
  return Boolean(v);
};

/* ================= MAIN FUNCTION ================= */
export async function getProductsFast() {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_TIME) {
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
        id: String(doc.id || ""),

        title: safeString(item.title),
        description: safeString(item.description),

        image: safeString(item.image),
        link: safeString(item.link),

        category: safeString(item.category),

        price: safeNumber(item.price),
        score: safeNumber(item.score || item.rating),

        views: safeNumber(item.views),
        clicks: safeNumber(item.clicks),

        viralBoost: safeBoolean(
          item.viralBoost ||
          item["viral boost"] ||
          item["تعزيز الانتشار الفيروسي"]
        ),
      };
    });

    cache = data;
    lastFetch = now;

    console.log(`Loaded ${data.length} products`);

    return data;
  } catch (e) {
    console.error("getProductsFast error:", e);
    return [];
  }
      }
