import { autonomousOS } from "./autonomousOS";
import { runGrowthEngine } from "../engine/growthEngine";
import { executeActions } from "./executeActions";

/* ================= SAFE HELPERS ================= */
const safe = (v, fallback = []) => (Array.isArray(v) ? v : fallback);

/* ================= AI MEMORY (Simple Learning Layer) ================= */
let memory = {
  bestPerforming: [],
  worstPerforming: [],
  lastDecisions: null,
};

/* ================= SCORE LEARNER ================= */
function learnFromResults(results) {
  if (!results) return;

  const all = [
    ...(results.trendingProducts || []),
    ...(results.topProducts || []),
  ];

  const scored = all.map((p) => ({
    ...p,
    finalScore:
      (p.views || 0) * 1 +
      (p.clicks || 0) * 2 +
      (p.orders || 0) * 10,
  }));

  scored.sort((a, b) => b.finalScore - a.finalScore);

  memory.bestPerforming = scored.slice(0, 10);
  memory.worstPerforming = scored.slice(-5);
}

/* ================= AI DECISION ENGINE ================= */
function aiDecisionLayer(data) {
  const {
    trendingProducts,
    topProducts,
    viralProducts,
    bestROI,
  } = data;

  return {
    homepageStrategy: [
      ...safe(trendingProducts).slice(0, 3),
      ...safe(bestROI).slice(0, 2),
    ],

    revenueStrategy: safe(topProducts).slice(0, 5),

    viralStrategy: safe(viralProducts).slice(0, 5),

    seoFocus: memory.bestPerforming.slice(0, 5),
  };
}

/* ================= AI CEO CORE ================= */
export async function aiCEO() {
  try {
    /* ================= RUN CORE ENGINE ================= */
    const data = await runGrowthEngine();

    /* ================= LEARN ================= */
    learnFromResults(data);

    /* ================= DECIDE ================= */
    const decisions = aiDecisionLayer(data);

    /* ================= EXECUTE ================= */
    const actions = await executeActions({
      ...decisions,
      aiMode: "CEO_FULL_CONTROL",
    });

    /* ================= SELF CHECK ================= */
    const health = {
      totalProducts: (data.trendingProducts || []).length,
      memorySize: memory.bestPerforming.length,
      mode: "AI_CEO_ACTIVE",
    };

    return {
      success: true,
      mode: "AI_CEO_v1",

      decisions,
      actions,
      memory,
      health,

      timestamp: new Date().toISOString(),
    };

  } catch (e) {
    return {
      success: false,
      mode: "AI_CEO_v1",
      error: e.message,
    };
  }
}
