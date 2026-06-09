import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= CACHE ================= */
let cache = null;
let lastFetch = 0;

const CACHE_TIME = 1000 * 60 * 30;

/* ================= SAFE ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }

  if (v?.toDate) return v.toDate().toISOString();

  if (Array.isArray(v)) return v.map(safeText).join(" ");

  if (typeof v === "object") {
    if (typeof v?.text === "string") return v.text;
    if (typeof v?.title === "string") return v.title;
    if (typeof v?.url === "string") return v.url;
    if (typeof v?.image === "string") return v.image;
    return "";
  }

  return "";
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export async function getProductsFast() {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_TIME) {
    return cache;
  }

  try {
    const snap = await getDocs(collection(db, "products"));

    const data = snap.docs.map((doc) => {
      const item = doc.data() || {};

      return {
        id: String(doc.id || ""),

        title: safeText(item.title),
        description: safeText(item.description),

        image: safeText(item.image),
        link: safeText(item.link),

        category: safeText(item.category),

        price: safeNumber(item.price),
        score: safeNumber(item.score || item.rating),

        views: safeNumber(item.views),
        clicks: safeNumber(item.clicks),

        viralBoost: Boolean(item.viralBoost),
      };
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
