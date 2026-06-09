import { db } from "../../config/firebase";

import {
  collection,
  getDocs,
  writeBatch,
  doc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= CACHE ================= */
let cache = null;
let lastRun = 0;

const CACHE_TTL = 1000 * 60 * 15;

/* ================= LEARNING ENGINE ================= */
function adjustScore(product = {}) {
  const views = Number(product.views || 0);
  const clicks = Number(product.clicks || 0);
  const orders = Number(product.orders || 0);

  let adjustment = 0;

  /* ================= CTR ================= */
  if (views > 0) {
    const ctr = clicks / views;

    if (ctr >= 0.2) adjustment += 15;
    else if (ctr <= 0.05) adjustment -= 20;
  }

  /* ================= CVR ================= */
  if (clicks > 0) {
    const cvr = orders / clicks;

    if (cvr >= 0.1) adjustment += 25;
    else if (cvr <= 0.02) adjustment -= 30;
  }

  /* ================= SALES SIGNAL ================= */
  if (orders > 5) adjustment += 20;

  if (orders === 0 && clicks > 20) {
    adjustment -= 10;
  }

  return adjustment;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    /* ================= METHOD CHECK ================= */
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        error: "Method Not Allowed",
      });
    }

    /* ================= MEMORY CACHE ================= */
    if (
      cache &&
      Date.now() - lastRun < CACHE_TTL
    ) {
      return res.status(200).json(cache);
    }

    const startedAt = Date.now();

    /* ================= FETCH ================= */
    const snap = await getDocs(
      collection(db, "analytics_products")
    );

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= BATCH ================= */
    const batch = writeBatch(db);

    let updated = 0;
    let positiveAdjustments = 0;
    let negativeAdjustments = 0;

    for (const p of products) {
      const adjustment = adjustScore(p);

      const newScore =
        Number(p.profitScore || 0) +
        adjustment;

      batch.update(
        doc(db, "analytics_products", p.id),
        {
          profitScore: newScore,
          learningAdjustment: adjustment,
          lastLearnedAt:
            serverTimestamp(),
        }
      );

      if (adjustment > 0)
        positiveAdjustments++;

      if (adjustment < 0)
        negativeAdjustments++;

      updated++;
    }

    if (updated > 0) {
      await batch.commit();
    }

    /* ================= CACHE ================= */
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=900, stale-while-revalidate=3600"
    );

    const result = {
      success: true,
      updated,
      positiveAdjustments,
      negativeAdjustments,
      runtime:
        Date.now() - startedAt,
    };

    cache = result;
    lastRun = Date.now();

    return res.status(200).json(result);

  } catch (error) {
    console.error(
      "LEARNING ENGINE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Internal Server Error",
    });
  }
      }
