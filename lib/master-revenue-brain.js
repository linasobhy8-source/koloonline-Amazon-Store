// lib/master-revenue-brain.js

import { calculateBrainScore } from "./revenue-intelligence";
import { autonomousEngine } from "./autonomousEngine";

/* ================= MASTER AI BRAIN ================= */
export function masterRevenueBrain(products = []) {
  if (!Array.isArray(products)) return [];

  return products
    .map((p) => {
      // 🧠 step 1: AI base scoring
      const aiBoosted = autonomousEngine([p])[0] || p;

      // 💰 step 2: revenue scoring
      const brainScore = calculateBrainScore({
        views: p.views,
        clicks: p.clicks,
        orders: p.orders || 0,
        price: p.price || 0,
      });

      // ⚡ final hybrid score
      const finalScore =
        brainScore +
        (aiBoosted.aiScore || 0) * 10 +
        (p.viralBoost ? 200 : 0);

      return {
        ...p,
        aiScore: aiBoosted.aiScore || 0,
        brainScore,
        finalScore,
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore);
}

/* ================= TOP PRODUCTS ================= */
export function getTopRevenue(products = [], limit = 20) {
  return masterRevenueBrain(products).slice(0, limit);
}

/* ================= AUTO LEARNING SIGNAL ================= */
export function learnFromPerformance(products = []) {
  return products.map((p) => {
    const score = p.finalScore || 0;

    return {
      ...p,
      profitTier:
        score > 5000
          ? "A++"
          : score > 2000
          ? "A"
          : score > 1000
          ? "B"
          : "C",
    };
  });
}
