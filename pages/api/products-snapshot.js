import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= CACHE ================= */
let cache = null;
let lastFetch = 0;
const CACHE_TTL = 1000 * 60 * 10;

/* ================= SAFE HELPERS ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v).trim();
  }

  return "";
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= ENGAGEMENT SCORE ================= */
function engagementScore(p = {}) {
  const views = safeNumber(p.views);
  const clicks = safeNumber(p.clicks);
  const orders = safeNumber(p.orders);
  const rating = safeNumber(p.rating);

  const ctr = views > 0 ? clicks / views : 0;

  return (
    views * 0.2 +
    clicks * 0.6 +
    orders * 2 +
    rating * 10 +
    ctr * 50 +
    (p.viralBoost ? 30 : 0)
  );
}

/* ================= JUNK FILTER ================= */
function isValidProduct(p = {}) {
  const title = (p.title || "").trim();
  const image = p.image;

  if (!title || title.length < 3) return false;
  if (!image || typeof image !== "string") return false;

  // ❌ missing engagement
  if ((p.views || 0) === 0 && (p.clicks || 0) === 0) return false;

  // ❌ low quality score
  const score = engagementScore(p);
  if (score < 25) return false;

  return true;
}

/* ================= VIRAL BOOST FILTER ================= */
function viralFilter(p = {}) {
  if (p.viralBoost) return true;

  // allow only high engagement non-viral
  const score = engagementScore(p);
  return score >= 60;
}

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  try {
    const now = Date.now();

    /* ================= CACHE ================= */
    if (cache && now - lastFetch < CACHE_TTL) {
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=600, stale-while-revalidate=3600"
      );
      return res.status(200).json(cache);
    }

    /* ================= FIRESTORE ================= */
    const q = query(
      collection(db, "products"),
      orderBy("score", "desc"),
      limit(200)
    );

    const snap = await getDocs(q);

    const rawData = snap.docs.map((doc) => {
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
        orders: safeNumber(item.orders),
        rating: safeNumber(item.rating),

        viralBoost: Boolean(item.viralBoost),
      };
    });

    /* ================= PIPELINE ================= */
    let data = rawData
      .filter(isValidProduct)
      .filter(viralFilter);

    /* ================= ENGAGEMENT SORT ================= */
    data.sort((a, b) => {
      return engagementScore(b) - engagementScore(a);
    });

    /* ================= CACHE ================= */
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
