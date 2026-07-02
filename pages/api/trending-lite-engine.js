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

  // weighted scoring (more realistic)
  return views * 1 + clicks * 2 + likes * 3 + viralBoost;
}

/* ================= CACHE (simple in-memory) ================= */
let cached = null;
let cachedTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const now = Date.now();

    // ================= RETURN CACHE =================
    if (cached && now - cachedTime < CACHE_TTL) {
      return res.status(200).json({
        success: true,
        trending: cached,
        cached: true,
      });
    }

    // ================= FETCH LIMITED =================
    const snap = await getDocs(
      query(collection(db, "products"), limit(100))
    );

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    if (!products.length) {
      return res.status(200).json({
        success: true,
        trending: [],
        message: "No products found",
      });
    }

    // ================= COMPUTE TRENDING =================
    const trending = products
      .map((p) => ({
        ...p,
        score: score(p),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // ================= UPDATE CACHE =================
    cached = trending;
    cachedTime = now;

    return res.status(200).json({
      success: true,
      trending,
      cached: false,
      meta: {
        total: products.length,
        engine: "lite-v2",
      },
    });

  } catch (e) {
    console.error("Trending engine error:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
      trending: [],
    });
  }
    }
