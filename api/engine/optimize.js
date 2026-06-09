import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { revenueScore } from "../../ai/agents/revenue-agent";

/* ================= CACHE ================= */
let cache = null;
let lastFetch = 0;
const TTL = 1000 * 60 * 5;

/* ================= SAFE SCORE ================= */
const safeScore = (p) => {
  try {
    return revenueScore(p) || 0;
  } catch {
    return 0;
  }
};

export default async function handler(req, res) {
  try {
    const now = Date.now();

    /* ================= CACHE HIT ================= */
    if (cache && now - lastFetch < TTL) {
      return res.status(200).json({
        ...cache,
        cached: true,
      });
    }

    /* ================= FIRESTORE ================= */
    const snap = await getDocs(collection(db, "products"));
    const docs = snap.docs;

    const products = new Array(docs.length);

    for (let i = 0; i < docs.length; i++) {
      const d = docs[i];
      const p = d.data();

      products[i] = {
        id: d.id,
        ...p,
        score: safeScore(p),
      };
    }

    products.sort((a, b) => b.score - a.score);

    const result = {
      success: true,
      top: products.slice(0, 20),
      meta: {
        total: products.length,
        cached: false,
        timestamp: now,
      },
    };

    cache = result;
    lastFetch = now;

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Unknown error",
    });
  }
}
