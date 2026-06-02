import { runGrowthEngine } from "../engine/growthEngine";
import { executeActions } from "./executeActions";

/* ================= SAFE HELPERS ================= */
const safeArray = (v) => (Array.isArray(v) ? v : []);

/* ================= SIMPLE LEARNING MEMORY ================= */
let memory = {
  bestPerforming: [],
  worstPerforming: [],
  lastDecisions: null,
};

/* ================= PERFORMANCE ANALYSIS ================= */
function analyzePerformance(items = []) {
  const scored = items.map((p) => {
    const score =
      (p.views || 0) +
      (p.clicks || 0) * 2 +
      (p.orders || 0) * 10;

    return {
      ...p,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  memory.bestPerforming = scored.slice(0, 10);
  memory.worstPerforming = scored.slice(-5);

  return scored;
}

/* ================= DECISION ENGINE ================= */
function decisionLayer(data = {}) {
  const {
    trendingProducts = [],
    topProducts = [],
    viralProducts = [],
    bestROI = [],
  } = data;

  return {
    homepageStrategy: [
      ...safeArray(trendingProducts).slice(0, 3),
      ...safeArray(bestROI).slice(0, 2),
    ],

    revenueStrategy: safeArray(topProducts).slice(0, 5),

    viralStrategy: safeArray(viralProducts).slice(0, 5),

    seoFocus: memory.bestPerforming.slice(0, 5),
  };
}

/* ================= AI CEO CORE ================= */
export async function aiCEO() {
  try {
    /* ================= RUN ENGINE ================= */
    const data = await runGrowthEngine();

    /* ================= LEARN FROM DATA ================= */
    const analyzed = {
      ...data,
      allProducts: analyzePerformance([
        ...(data.trendingProducts || []),
        ...(data.topProducts || []),
      ]),
    };

    /* ================= MAKE DECISIONS ================= */
    const decisions = decisionLayer(analyzed);

    /* ================= EXECUTE ACTIONS ================= */
    const actions = await executeActions({
      ...decisions,
      mode: "AI_CEO_CONTROLLED",
    });

    /* ================= SYSTEM STATUS ================= */
    const health = {
      totalTrending: (data.trendingProducts || []).length,
      memorySize: memory.bestPerforming.length,
      mode: "AI_CEO_ACTIVE",
    };

    return {
      success: true,
      version: "AI_CEO_v1",

      decisions,
      actions,
      memory,
      health,

      timestamp: new Date().toISOString(),
    };

  } catch (e) {
    return {
      success: false,
      version: "AI_CEO_v1",
      error: e.message,
    };
  }
    }
