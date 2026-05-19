import { runGrowthEngine } from "../engine/growthEngine";
import { executeActions } from "./executeActions";

/* ================= COMPANY MEMORY ================= */
const createInitialState = () => ({
  revenueFocus: [],
  trafficFocus: [],
  contentFocus: [],
  weakPoints: [],
});

/* نخليها داخل function بدل global mutable state */
let companyState = createInitialState();

/* ================= ANALYTICS ENGINE ================= */
function analyze(data = {}) {
  const products = data.topProducts || [];
  const trending = data.trendingProducts || [];
  const viral = data.viralProducts || [];

  const all = [...products, ...trending, ...viral];

  return all
    .map((p) => ({
      ...p,
      businessScore:
        (p.views || 0) * 1 +
        (p.clicks || 0) * 2 +
        (p.orders || 0) * 10 +
        (p.viralBoost ? 50 : 0),
    }))
    .sort((a, b) => b.businessScore - a.businessScore);
}

/* ================= STRATEGY BUILDER ================= */
function buildStrategy(scored = []) {
  const top = scored.slice(0, 10);
  const weak = scored.slice(-5);

  companyState = {
    revenueFocus: top.slice(0, 5),
    trafficFocus: top.slice(5, 10),
    contentFocus: top.filter((p) => (p.views || 0) > 100).slice(0, 5),
    weakPoints: weak,
  };

  return {
    homepage: companyState.trafficFocus,
    revenue: companyState.revenueFocus,
    content: companyState.contentFocus,
    cleanup: companyState.weakPoints,
  };
}

/* ================= AUTO GROWTH LOOP ================= */
async function growthLoop(strategy = {}) {
  try {
    return await executeActions({
      ...strategy,
      mode: "AUTONOMOUS_COMPANY_OS",
    });
  } catch (err) {
    console.error("Growth loop error:", err);
    return {
      success: false,
      error: err.message,
    };
  }
}

/* ================= SELF HEALING ================= */
function selfRepair(data = {}) {
  const issues = [];

  if (!data.topProducts?.length) issues.push("NO_TOP_PRODUCTS");
  if (!data.trendingProducts?.length) issues.push("NO_TRENDING_DATA");
  if (!data.viralProducts?.length) issues.push("NO_VIRAL_DATA");

  return {
    status: issues.length ? "DEGRADED" : "HEALTHY",
    issues,
    action: issues.length ? "FALLBACK_MODE" : "NORMAL",
  };
}

/* ================= RESET FUNCTION (important for serverless) ================= */
function resetState() {
  companyState = createInitialState();
}

/* ================= MAIN COMPANY BRAIN ================= */
export async function autonomousCompanyOS() {
  try {
    resetState();

    /* STEP 1: DATA */
    const data = await runGrowthEngine();

    /* STEP 2: HEALTH CHECK */
    const health = selfRepair(data);

    /* STEP 3: ANALYSIS */
    const scored = analyze(data);

    /* STEP 4: STRATEGY */
    const strategy = buildStrategy(scored);

    /* STEP 5: EXECUTION */
    const actions = await growthLoop(strategy);

    return {
      success: true,
      mode: "AUTONOMOUS_COMPANY_OS_V2",

      health,
      strategy,
      actions,

      metrics: {
        total: scored.length,
        revenueTargets: companyState.revenueFocus.length,
        trafficTargets: companyState.trafficFocus.length,
        contentTargets: companyState.contentFocus.length,
      },

      timestamp: new Date().toISOString(),
    };
  } catch (e) {
    return {
      success: false,
      mode: "AUTONOMOUS_COMPANY_OS_V2",
      error: e?.message || "UNKNOWN_ERROR",
    };
  }
}
