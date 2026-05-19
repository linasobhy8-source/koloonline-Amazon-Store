import { neuralFeedbackLoop } from "./neuralFeedbackLoop";
import { getSystemHealth } from "../lib/monitoring/systemHealth";
import { runGrowthEngine } from "./growthEngine";

/* ================= SELF EVOLVING CORE ================= */
export async function selfEvolvingCore() {
  try {
    /* ================= 1. SYSTEM STATE ================= */
    const health = await getSystemHealth();

    /* ================= 2. RUN GROWTH ENGINE ================= */
    const data = await runGrowthEngine();

    /* ================= 3. NEURAL FEEDBACK LOOP ================= */
    const neural = await neuralFeedbackLoop();

    /* ================= 4. PERFORMANCE ANALYSIS ================= */
    const performanceScore = calculatePerformance({
      health,
      data,
      neural,
    });

    /* ================= 5. EVOLUTION DECISION ================= */
    const evolutionPlan = decideEvolution(performanceScore, {
      health,
      neural,
    });

    /* ================= 6. APPLY SELF CHANGES ================= */
    const result = await applyEvolution(evolutionPlan);

    return {
      success: true,
      performanceScore,
      evolutionPlan,
      result,
    };

  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
}

/* ================= PERFORMANCE ENGINE ================= */
function calculatePerformance({ health, data, neural }) {
  const traffic = data?.trendingProducts?.length || 0;
  const revenue = data?.topProducts?.length || 0;
  const errors = health?.errors || 0;
  const success = neural?.success ? 1 : 0;

  return (
    traffic * 2 +
    revenue * 3 +
    success * 10 -
    errors * 5
  );
}

/* ================= EVOLUTION DECISION ================= */
function decideEvolution(score, { health }) {
  if (score > 80) {
    return {
      mode: "scale",
      action: "increaseTraffic + boostContent + expandSEO",
    };
  }

  if (score > 40) {
    return {
      mode: "optimize",
      action: "refineContent + improveCTR + adjustRanking",
    };
  }

  return {
    mode: "repair",
    action: "fixErrors + regenerateContent + cleanupLowPages",
  };
}

/* ================= APPLY EVOLUTION ================= */
async function applyEvolution(plan) {
  switch (plan.mode) {
    case "scale":
      return {
        message: "Scaling system...",
        changes: ["more content generation", "SEO expansion", "traffic boost"],
      };

    case "optimize":
      return {
        message: "Optimizing system...",
        changes: ["CTR tuning", "ranking adjustment", "content refresh"],
      };

    case "repair":
      return {
        message: "Repairing system...",
        changes: ["error cleanup", "content regeneration", "index reset"],
      };

    default:
      return { message: "No action" };
  }
}
