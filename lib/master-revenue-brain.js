// lib/master-revenue-brain.js

import { calculateBrainScore } from "./revenue-intelligence";
import { autonomousEngine } from "./autonomousEngine";

/* ================= MASTER AI BRAIN ================= */

export function masterRevenueBrain(products = []) {
  if (!Array.isArray(products)) {
    return [];
  }

  return products
    .map((p) => {
      const product =
        p && typeof p === "object" ? p : {};

      // 🧠 AI layer
      const aiBoosted =
        autonomousEngine([product])?.[0] ||
        product;

      // 💰 Revenue layer
      const brainScore = calculateBrainScore({
        views: Number(product.views || 0),
        clicks: Number(product.clicks || 0),
        orders: Number(product.orders || 0),
        price: Number(product.price || 0),
      });

      // ⚡ Final score
      const finalScore =
        Number(brainScore || 0) +
        Number(aiBoosted?.aiScore || 0) * 10 +
        (product.viralBoost ? 200 : 0);

      return {
        ...product,
        aiScore: Number(aiBoosted?.aiScore || 0),
        brainScore: Number(brainScore || 0),
        finalScore,
      };
    })
    .sort(
      (a, b) =>
        Number(b?.finalScore || 0) -
        Number(a?.finalScore || 0)
    );
}

/* ================= TOP PRODUCTS ================= */

export function getTopRevenue(
  products = [],
  limit = 20
) {
  return masterRevenueBrain(products).slice(
    0,
    Number(limit || 20)
  );
}

/* ================= AUTO LEARNING ================= */

export function learnFromPerformance(
  products = []
) {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.map((p) => {
    const score = Number(
      p?.finalScore || 0
    );

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
