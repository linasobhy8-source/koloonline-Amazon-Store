/* ================= DECISION ENGINE v2 (FINAL AI LAYER) ================= */

import { productBrain } from "./productBrain";

export function decisionEngine(products = []) {
  if (!Array.isArray(products)) return [];

  /* ================= STEP 1: BASE SCORING ================= */
  const scored = productBrain(products);

  /* ================= STEP 2: DECISION RULES ================= */

  return scored
    .map((p) => {
      const views = Number(p.views) || 0;
      const clicks = Number(p.clicks) || 0;
      const orders = Number(p.orders) || 0;
      const score = Number(p.score) || 0;

      /* ================= FINAL AI DECISION ================= */

      let decision = "reject";

      if (score >= 500 && orders > 5) {
        decision = "elite_index";
      } else if (score >= 300 && clicks > 20) {
        decision = "index_boost";
      } else if (score >= 150) {
        decision = "index";
      } else if (score >= 80 && views > 50) {
        decision = "maybe";
      }

      /* ================= PRIORITY ================= */

      const priority =
        decision === "elite_index"
          ? 1.0
          : decision === "index_boost"
          ? 0.9
          : decision === "index"
          ? 0.75
          : decision === "maybe"
          ? 0.5
          : 0.1;

      return {
        ...p,

        decision,
        priority,

        isApproved: decision !== "reject",
        isIndexable:
          decision === "index" ||
          decision === "index_boost" ||
          decision === "elite_index",
      };
    })

    /* ================= FINAL SORT ================= */
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return (b.score || 0) - (a.score || 0);
    });
        }
