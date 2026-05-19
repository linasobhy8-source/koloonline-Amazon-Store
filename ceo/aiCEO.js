import { runGrowthEngine } from "../engine/growthEngine";
import { selfEvolvingCore } from "../engine/selfEvolvingCore";
import { selfHealingEngine } from "../engine/selfHealingEngine";
import { neuralFeedbackLoop } from "../engine/neuralFeedbackLoop";
import { executeActions } from "../engine/executeActions";

/* ================= AI CEO CORE ================= */
export async function aiCEO() {
  try {
    /* ================= 1. MARKET INTELLIGENCE ================= */
    const growthData = await runGrowthEngine();

    /* ================= 2. SELF ANALYSIS ================= */
    const evolution = await selfEvolvingCore();

    /* ================= 3. SELF HEALING ================= */
    const healing = await selfHealingEngine();

    /* ================= 4. NEURAL INSIGHTS ================= */
    const neural = await neuralFeedbackLoop();

    /* ================= 5. STRATEGIC DECISION ENGINE ================= */
    const strategy = buildStrategy({
      growthData,
      evolution,
      healing,
      neural,
    });

    /* ================= 6. EXECUTION ================= */
    const actions = await executeActions(strategy);

    /* ================= 7. CEO REPORT ================= */
    return {
      success: true,
      strategy,
      actions,
      summary: generateCEOReport({
        growthData,
        evolution,
        healing,
        neural,
      }),
    };

  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
}

/* ================= STRATEGY ENGINE ================= */
function buildStrategy({ growthData, evolution, healing, neural }) {
  const traffic = growthData?.trendingProducts?.length || 0;
  const revenue = growthData?.topProducts?.length || 0;
  const risk = healing?.brokenFixed || 0;
  const optimization = evolution?.performanceScore || 0;

  /* ================= DECISION MATRIX ================= */
  const score =
    traffic * 2 +
    revenue * 3 +
    optimization * 1.5 -
    risk * 2;

  if (score > 120) {
    return {
      mode: "EXPANSION",
      actions: [
        "increase content generation",
        "scale SEO clusters",
        "expand blog categories",
        "boost trending products",
      ],
    };
  }

  if (score > 60) {
    return {
      mode: "OPTIMIZATION",
      actions: [
        "improve CTR pages",
        "refine keywords",
        "reorder homepage feed",
        "enhance monetization pages",
      ],
    };
  }

  return {
    mode: "RECOVERY",
    actions: [
      "repair low performance pages",
      "regenerate weak content",
      "reduce dead traffic routes",
      "clean SEO structure",
    ],
  };
}

/* ================= CEO REPORT ================= */
function generateCEOReport({ growthData, evolution, healing, neural }) {
  return {
    totalProducts: growthData?.total || 0,
    topProducts: growthData?.topProducts?.length || 0,
    trending: growthData?.trendingProducts?.length || 0,

    systemHealth: {
      evolutionScore: evolution?.performanceScore || 0,
      fixedPages: healing?.brokenFixed || 0,
      improvedPages: healing?.improved || 0,
    },

    neuralInsights: neural?.opportunities?.length || 0,

    status: "AI CEO Running Autonomous Business System",
  };
}
