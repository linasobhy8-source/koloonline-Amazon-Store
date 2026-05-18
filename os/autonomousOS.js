import { runGrowthEngine } from "../engine/growthEngine";
import { trafficController } from "./trafficController";
import { revenueOptimizer } from "./revenueOptimizer";
import { executeActions } from "./executeActions";
import { neuralFeedbackLoop } from "./neuralFeedbackLoop";

/* ================= SAFE HELPERS ================= */
const safeArray = (v) => (Array.isArray(v) ? v : []);

/* ================= MAIN ORCHESTRATOR ================= */
export async function autonomousOS() {
  try {
    /* ================= GROWTH ENGINE ================= */
    const data = await runGrowthEngine();

    let {
      trendingProducts,
      topProducts,
      viralProducts,
      bestROI,
    } = data || {};

    trendingProducts = safeArray(trendingProducts);
    topProducts = safeArray(topProducts);
    viralProducts = safeArray(viralProducts);
    bestROI = safeArray(bestROI);

    /* ================= TRAFFIC INTELLIGENCE ================= */
    const trafficSorted = trafficController(trendingProducts).slice(0, 10);

    /* ================= REVENUE INTELLIGENCE ================= */
    const revenueSorted = revenueOptimizer(topProducts).slice(0, 10);

    /* ================= VIRAL BOOST LAYER ================= */
    const viralBoosted = viralProducts
      .map((p) => ({
        ...p,
        viralScore: (p.views || 0) * 2 + (p.clicks || 0) * 3,
      }))
      .sort((a, b) => b.viralScore - a.viralScore)
      .slice(0, 10);

    /* ================= DECISIONS ENGINE ================= */
    const decisions = {
      homepage: trafficSorted.slice(0, 5),
      revenue: revenueSorted.slice(0, 5),
      viral: viralBoosted.slice(0, 5),
      roi: bestROI.slice(0, 5),
    };

    /* ================= NEURAL FEEDBACK LOOP ================= */
    const neural = await neuralFeedbackLoop();

    /* ================= AUTO PRIORITY EXECUTION ================= */
    const actions = await executeActions({
      ...decisions,
      neuralInsights: neural,
    });

    /* ================= FINAL INTELLIGENCE OUTPUT ================= */
    return {
      success: true,

      engine: "autonomous-os-v3",

      metrics: {
        trending: trendingProducts.length,
        revenue: topProducts.length,
        viral: viralProducts.length,
      },

      decisions,
      actions,
      neural,

      timestamp: new Date().toISOString(),
    };

  } catch (e) {
    return {
      success: false,
      engine: "autonomous-os-v3",
      error: e.message,
    };
  }
}
