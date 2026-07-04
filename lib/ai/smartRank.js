/* ================= SMART RANK v2 ================= */
/* يعتمد على productBrain كـ source of truth */

import { productBrain } from "./productBrain";

export function smartRank(products = []) {
  if (!Array.isArray(products)) return [];

  /* ================= STEP 1: APPLY PRODUCT BRAIN ================= */

  const scored = productBrain(products);

  /* ================= STEP 2: NORMALIZE SCORE ================= */

  const maxScore = Math.max(...scored.map((p) => p.score || 0), 1);

  const normalized = scored.map((p) => {
    const normalizedScore = (p.score / maxScore) * 100;

    return {
      ...p,

      score: Math.round(normalizedScore),

      rankTier:
        normalizedScore >= 80
          ? "S"
          : normalizedScore >= 60
          ? "A"
          : normalizedScore >= 40
          ? "B"
          : "C",
    };
  });

  /* ================= STEP 3: FINAL SORT ================= */

  return normalized.sort((a, b) => b.score - a.score);
}
