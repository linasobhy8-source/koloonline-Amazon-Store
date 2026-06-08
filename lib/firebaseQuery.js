import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= CACHE ================= */
let cache = null;
let lastFetch = 0;

const CACHE_TIME = 1000 * 60 * 30; // 30 min

/* ================= HARD SAFE CLEANERS ================= */
const safeString = (v) => {
  if (v === null || v === undefined) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  // Firebase Timestamp
  if (v?.toDate) return v.toDate().toISOString();

  // arrays
  if (Array.isArray(v)) {
    return v.map(safeString).join(" ");
  }

  // objects → لا نسمح بتمرير object للـ UI نهائيًا
  if (typeof v === "object") {
    return v?.text || v?.value || v?.title || "";
  }

  return "";
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeBoolean = (v) => Boolean(v);

/* ================= MAIN ================= */
export async function getProductsFast() {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_TIME) {
    return cache;
  }

  try {
    const q = query(collection(db, "products"), limit(80));
    const snap = await getDocs(q);

    const data = snap.docs.map((doc) => {
      const item = doc.data() || {};

      const product = {
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

      return product;
    });

    cache = data;
    lastFetch = now;

    console.log("🔥 Loaded products:", data.length);

    return data;
  } catch (e) {
    console.error("❌ getProductsFast error:", e);
    return [];
  }
        }
