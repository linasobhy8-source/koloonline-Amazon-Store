import { db } from "../../config/firebase";
import { collection, getDocs, query, limit } from "firebase/firestore";

/* ================= SAFE NUMBER ================= */
const num = (v) => (typeof v === "number" ? v : parseFloat(v) || 0);

/* ================= SCORE ENGINE ================= */
function score(p) {
  const views = num(p.views);
  const clicks = num(p.clicks);
  const likes = num(p.likes);
  const viralBoost = p.viralBoost ? 100 : 0;

  return views + clicks * 2 + likes * 3 + viralBoost;
}

/* ================= CACHE ================= */
let cached = null;
let cachedTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    console.log("========== TRENDING ENGINE START ==========");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Time:", new Date().toISOString());

    const now = Date.now();

    /* ================= CACHE HIT ================= */
    if (cached && now - cachedTime < CACHE_TTL) {
      console.log("CACHE HIT ✅");

      return res.status(200).json({
        success: true,
        trending: cached,
        cached: true,
      });
    }

    console.log("CACHE MISS ❌ - Fetching Firestore");

    /* ================= FETCH DATA ================= */
    const snap = await getDocs(
      query(collection(db, "products"), limit(100))
    );

    console.log("Firestore docs fetched:", snap.size);

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    console.log("Products mapped:", products.length);

    if (!products.length) {
      console.log("No products found ⚠️");

      return res.status(200).json({
        success: true,
        trending: [],
        message: "No products found",
      });
    }

    /* ================= CALCULATE TRENDING ================= */
    const trending = products
      .map((p) => ({
        ...p,
        score: score(p),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    console.log("Top trending generated:", trending.length);
    console.log("Top score:", trending[0]?.score || 0);

    /* ================= UPDATE CACHE ================= */
    cached = trending;
    cachedTime = now;

    console.log("CACHE UPDATED 🔥");
    console.log("========== END ENGINE ==========");

    return res.status(200).json({
      success: true,
      trending,
      cached: false,
      meta: {
        total: products.length,
        engine: "debug-lite-v2",
      },
    });
  } catch (e) {
    console.error("TRENDING ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
      trending: [],
    });
  }
}
