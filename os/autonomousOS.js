import { runGrowthEngine } from "../engine/growthEngine";
import { executeActions } from "./executeActions";

/* ================= COMPANY MEMORY ================= */
let companyState = {
  revenueFocus: [],
  trafficFocus: [],
  contentFocus: [],
  weakPoints: [],
};

/* ================= ANALYTICS ENGINE ================= */
function analyze(data) {
  const products = data?.topProducts || [];
  const trending = data?.trendingProducts || [];
  const viral = data?.viralProducts || [];

  const all = [...products, ...trending, ...viral];

  const scored = all.map((p) => ({
    ...p,
    businessScore:
      (p.views || 0) * 1 +
      (p.clicks || 0) * 2 +
      (p.orders || 0) * 10 +
      (p.viralBoost ? 50 : 0),
  }));

  scored.sort((a, b) => b.businessScore - a.businessScore);

  return scored;
}

/* ================= STRATEGY BUILDER ================= */
function buildStrategy(scored) {
  const top = scored.slice(0, 10);
  const weak = scored.slice(-5);

  companyState.revenueFocus = top.slice(0, 5);
  companyState.trafficFocus = top.slice(5, 10);
  companyState.weakPoints = weak;

  companyState.contentFocus = top
    .filter((p) => p.views > 100)
    .slice(0, 5);

  return {
    homepage: companyState.trafficFocus,
    revenue: companyState.revenueFocus,
    content: companyState.contentFocus,
    cleanup: companyState.weakPoints,
  };
}

/* ================= AUTO GROWTH LOOP ================= */
async function growthLoop(strategy) {
  const actions = await executeActions({
    ...strategy,
    mode: "AUTONOMOUS_COMPANY_OS",
  });

  return actions;
}

/* ================= SELF HEALING ================= */
function selfRepair(data) {
  const issues = [];

  if (!data?.topProducts?.length) {
    issues.push("NO_TOP_PRODUCTS");
  }

  if (!data?.trendingProducts?.length) {
    issues.push("NO_TRENDING_DATA");
  }

  if (issues.length) {
    return {
      status: "DEGRADED",
      issues,
      action: "FALLBACK_MODE",
    };
  }

  return {
    status: "HEALTHY",
    issues: [],
  };
}

/* ================= MAIN COMPANY BRAIN ================= */
export async function autonomousCompanyOS() {
  try {
    /* ================= STEP 1: COLLECT DATA ================= */
    const data = await runGrowthEngine();

    /* ================= STEP 2: SELF CHECK ================= */
    const health = selfRepair(data);

    /* ================= STEP 3: ANALYZE ================= */
    const scored = analyze(data);

    /* ================= STEP 4: STRATEGY ================= */
    const strategy = buildStrategy(scored);

    /* ================= STEP 5: EXECUTE ================= */
    const actions = await growthLoop(strategy);

    return {
      success: true,

      mode: "AUTONOMOUS_COMPANY_OS_V1",

      health,
      strategy,
      actions,

      metrics: {
        total: scored.length,
        revenueTargets: companyState.revenueFocus.length,
        trafficTargets: companyState.trafficFocus.length,
      },

      timestamp: new Date().toISOString(),
    };

  } catch (e) {
    return {
      success: false,
      mode: "AUTONOMOUS_COMPANY_OS_V1",
      error: e.message,
    };
  }
  }
