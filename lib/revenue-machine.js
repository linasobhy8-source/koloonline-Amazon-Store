// lib/revenue-machine.js

import { calculateBrainScore } from "./revenue-intelligence";

/* ================= FILTER BEST PRODUCTS ================= */
function filterProducts(products = []) {
  return products.filter((p) => {
    return (
      p &&
      p.title &&
      p.image &&
      typeof p.price === "number" &&
      p.price > 0
    );
  });
}

/* ================= CTR BOOST LOGIC ================= */
function ctrBoost(product) {
  let boost = 1;

  // منتجات رخيصة = click أعلى
  if (product.price < 30) boost += 0.4;

  // صور Amazon = ثقة أعلى
  if (product.image?.includes("amazon")) boost += 0.2;

  // viral products
  if (product.viralBoost) boost += 0.8;

  return boost;
}

/* ================= MAIN REVENUE ENGINE ================= */
export function revenueMachine(products = []) {
  const clean = filterProducts(products);

  return clean
    .map((p) => {
      const brainScore = calculateBrainScore({
        views: p.views,
        clicks: p.clicks,
        orders: p.orders || 0,
        price: p.price,
      });

      const ctrMultiplier = ctrBoost(p);

      // 💰 final profit score
      const profitScore = brainScore * ctrMultiplier;

      return {
        ...p,
        brainScore,
        ctrMultiplier,
        profitScore,
      };
    })
    .sort((a, b) => b.profitScore - a.profitScore);
}

/* ================= TOP MONEY PRODUCTS ================= */
export function getMoneyProducts(products = [], limit = 20) {
  return revenueMachine(products).slice(0, limit);
}

/* ================= WINNER DETECTOR ================= */
export function isWinner(product) {
  return (product.profitScore || 0) > 2000;
}
