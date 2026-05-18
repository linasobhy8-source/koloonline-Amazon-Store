import { runGrowthEngine } from "../engine/growthEngine";
import { trafficController } from "./trafficController";
import { revenueOptimizer } from "./revenueOptimizer";
import { executeActions } from "./executeActions";

/* ================= MAIN ORCHESTRATOR ================= */
export async function autonomousOS() {
  try {
    const data = await runGrowthEngine();

    let { trendingProducts, topProducts, viralProducts, bestROI } = data;

    /* ================= TRAFFIC ================= */
    const trafficSorted = trafficController(trendingProducts);

    /* ================= REVENUE ================= */
    const revenueSorted = revenueOptimizer(topProducts);

    /* ================= DECISIONS ================= */
    const decisions = {
      homepage: trafficSorted.slice(0, 5),
      revenue: revenueSorted.slice(0, 5),
      viral: viralProducts.slice(0, 5),
    };

    /* ================= EXECUTE ================= */
    const actions = await executeActions(decisions);

    return {
      success: true,
      decisions,
      actions,
    };

  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
}
