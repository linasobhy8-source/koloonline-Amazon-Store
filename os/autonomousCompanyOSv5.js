import { aiCEO } from "../ceo/aiCEO";
import { neuralFeedbackLoop } from "../engine/neuralFeedbackLoop";
import { selfEvolvingCore } from "../engine/selfEvolvingCore";
import { selfHealingEngine } from "../engine/selfHealingEngine";
import { runGrowthEngine } from "../engine/growthEngine";
import { executeActions } from "../engine/executeActions";

/* ================= AUTONOMOUS COMPANY OS v5 ================= */
export async function autonomousCompanyOSv5() {
  try {
    /* ================= 1. MARKET SCAN ================= */
    const market = await runGrowthEngine();

    /* ================= 2. AI CEO DECISION ================= */
    const ceoDecision = await aiCEO();

    /* ================= 3. SELF EVOLUTION ================= */
    const evolution = await selfEvolvingCore();

    /* ================= 4. SELF HEALING ================= */
    const healing = await selfHealingEngine();

    /* ================= 5. NEURAL LEARNING ================= */
    const neural = await neuralFeedbackLoop();

    /* ================= 6. STRATEGIC MERGE ================= */
    const strategy = mergeStrategies({
      market,
      ceoDecision,
      evolution,
      healing,
      neural,
    });

    /* ================= 7. EXECUTION ENGINE ================= */
    const execution = await executeActions(strategy);

    /* ================= 8. COMPANY STATE ================= */
    return {
      success: true,
      version: "v5-AUTONOMOUS-COMPANY-OS",

      state: {
        marketSize: market?.total || 0,
        topProducts: market?.topProducts?.length || 0,
        trending: market?.trendingProducts?.length || 0,
        viral: market?.viralProducts?.length || 0,
      },

      ceo: ceoDecision?.strategy?.mode || "UNKNOWN",

      system: {
        evolutionScore: evolution?.performanceScore || 0,
        healingScore: healing?.health || 0,
        neuralOpportunities: neural?.opportunities?.length || 0,
      },

      execution,
      strategy,
    };

  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
}

/* ================= STRATEGY MERGER ================= */
function mergeStrategies({ market, ceoDecision, evolution, healing, neural }) {
  const baseScore =
    (market?.trendingProducts?.length || 0) * 2 +
    (market?.topProducts?.length || 0) * 3 +
    (neural?.opportunities?.length || 0) * 4 +
    (evolution?.performanceScore || 0) -
    (healing?.brokenPages || 0) * 2;

  /* ================= FINAL MODE DECISION ================= */
  if (baseScore > 200) {
    return {
      mode: "AGGRESSIVE_GROWTH",
      actions: [
        "generate new SEO clusters",
        "create high-profit blog posts",
        "expand homepage feed",
        "push viral products",
        "increase internal linking density",
      ],
    };
  }

  if (baseScore > 100) {
    return {
      mode: "STABLE_GROWTH",
      actions: [
        "optimize trending pages",
        "refresh old content",
        "improve CTR titles",
        "boost affiliate conversion pages",
      ],
    };
  }

  return {
    mode: "RECOVERY_MODE",
    actions: [
      "fix broken SEO pages",
      "regenerate low traffic content",
      "remove dead pages from sitemap",
      "rebuild internal linking graph",
    ],
  };
}
