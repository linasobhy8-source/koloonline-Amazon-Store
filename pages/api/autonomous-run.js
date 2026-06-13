import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";

import { getMoneyProducts } from "../../lib/revenue-machine";

/* ================= CACHE ================= */
let cache = null;
let lastRun = 0;

const CACHE_TTL = 1000 * 60 * 10; // 10 min

/* ================= SAFE NUMBER ================= */
const n = (v) => Number(v) || 0;

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    /* ================= METHOD GUARD ================= */
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        error: "Method Not Allowed",
      });
    }

    const now = Date.now();

    /* ================= CACHE HIT ================= */
    if (cache && now - lastRun < CACHE_TTL) {
      return res.status(200).json(cache);
    }

    /* ================= FETCH PRODUCTS ================= */
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= REVENUE AI ENGINE ================= */
    products = getMoneyProducts(products).map((p) => ({
      ...p,
      profitScore: n(p.profitScore),
      brainScore: n(p.brainScore),
      ctrMultiplier: n(p.ctrMultiplier) || 1,
    }));

    /* ================= SORT BY PROFIT ================= */
    products.sort((a, b) => b.profitScore - a.profitScore);

    const top = products.slice(0, 20);

    /* ================= BATCH OPTIMIZATION ================= */
    const batch = writeBatch(db);

    top.forEach((p) => {
      const ref = doc(db, "products", p.id);

      batch.update(ref, {
        profitScore: n(p.profitScore),
        brainScore: n(p.brainScore),
        ctrMultiplier: n(p.ctrMultiplier),
        lastOptimized: now,
      });
    });

    await batch.commit();

    /* ================= RESPONSE ================= */
    const response = {
      success: true,
      engine: "autonomous-v2",
      totalProducts: products.length,
      optimizedProducts: top.length,
      runtime: Date.now() - now,
      top,
      status: "Revenue Machine ACTIVE",
    };

    /* ================= CACHE STORE ================= */
    cache = response;
    lastRun = Date.now();

    /* ================= HEADERS ================= */
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=3600"
    );

    return res.status(200).json(response);
  } catch (e) {
    console.error("Autonomous Run Error:", e);

    return res.status(500).json({
      success: false,
      error: e?.message || "Internal Server Error",
    });
  }
}
