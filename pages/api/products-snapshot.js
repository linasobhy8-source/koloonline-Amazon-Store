import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= MEMORY CACHE ================= */
let cache = null;
let lastFetch = 0;

const CACHE_TTL = 1000 * 60 * 10;

/* ================= SAFE HELPERS ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    return String(v).trim();
  }

  return "";
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= API ================= */
export default async function handler(req, res) {
  try {
    const now = Date.now();

    /* ================= CACHE HIT ================= */
    if (cache && now - lastFetch < CACHE_TTL) {
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=600, stale-while-revalidate=3600"
      );

      return res.status(200).json(cache);
    }

    /* ================= FIRESTORE QUERY ================= */
    const q = query(
      collection(db, "products"),
      orderBy("score", "desc"),
      limit(200)
    );

    const snap = await getDocs(q);

    const data = snap.docs.map((doc) => {
      const item = doc.data() || {};

      return {
        id: String(doc.id),
        title: safeText(item.title),
        description: safeText(item.description),
        image: safeText(item.image),
        link: safeText(item.link),
        category: safeText(item.category),

        price: safeNumber(item.price),
        score: safeNumber(item.score),
        views: safeNumber(item.views),
        clicks: safeNumber(item.clicks),

        viralBoost: Boolean(item.viralBoost),
      };
    });

    /* ================= SET CACHE ================= */
    cache = data;
    lastFetch = now;

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=3600"
    );

    return res.status(200).json(data);
  } catch (e) {
    console.error("API PRODUCTS ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e?.message || "Internal Server Error",
    });
  }
        }
