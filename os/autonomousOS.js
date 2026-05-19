import { runGrowthEngine } from "../engine/growthEngine";
import { executeActions } from "./executeActions";

/* ================= STATE FACTORY (SERVERLESS SAFE) ================= */
const createState = () => ({
  revenueFocus: [],
  trafficFocus: [],
  contentFocus: [],
  weakPoints: [],
});

/* ================= ANALYTICS ENGINE ================= */
function analyze(data = {}) {
  const items = [
    ...(data.topProducts || []),
    ...(data.trendingProducts || []),
    ...(data.viralProducts || []),
  ];

  return items
    .map((p) => ({
      ...p,
      businessScore:
        (p.views || 0) +
        (p.clicks || 0) * 2 +
        (p.orders || 0) * 10 +
        (p.viralBoost ? 50 : 0),
    }))
    .sort((a, b) => b.businessScore - a.businessScore);
}

/* ================= STRATEGY BUILDER ================= */
function buildStrategy(scored = []) {
  const state = createState();

  const top = scored.slice(0, 10);

  state.revenueFocus = top.slice(0, 5);
  state.trafficFocus = top.slice(5, 10);
  state.contentFocus = top.filter((p) => (p.views || 0) > 100).slice(0, 5);
  state.weakPoints = scored.slice(-5);

  return {
    state,
    homepage: state.trafficFocus,
    revenue: state.revenueFocus,
    content: state.contentFocus,
    cleanup: state.weakPoints,
  };
}

/* ================= SAFE EXECUTION LAYER ================= */
async function execute(strategy = {}) {
  try {
    return await executeActions({
      ...strategy,
      mode: "V6_AUTONOMOUS_OS",
    });
  } catch (err) {
    return {
      success: false,
      error: err?.message || "EXECUTION_ERROR",
    };
  }
}

/* ================= HEALTH SYSTEM ================= */
function healthCheck(data = {}) {
  const issues = [];

  if (!data?.topProducts?.length) issues.push("NO_TOP_PRODUCTS");
  if (!data?.trendingProducts?.length) issues.push("NO_TRENDING");
  if (!data?.viralProducts?.length) issues.push("NO_VIRAL");

  return {
    status: issues.length ? "DEGRADED" : "HEALTHY",
    issues,
    action: issues.length ? "FALLBACK_MODE" : "NORMAL",
  };
}

/* ================= MAIN V6 ENGINE ================= */
export async function autonomousCompanyOS() {
  try {
    /* STEP 1: DATA COLLECTION */
    const data = await runGrowthEngine();

    /* STEP 2: HEALTH CHECK */
    const health = healthCheck(data);

    /* STEP 3: ANALYSIS */
    const scored = analyze(data || {});

    /* STEP 4: STRATEGY */
    const strategy = buildStrategy(scored);

    /* STEP 5: EXECUTION */
    const actions = await execute(strategy);

    return {
      success: true,
      version: "V6_AUTONOMOUS_COMPANY_OS",

      health,
      strategy,
      actions,

      metrics: {
        total: scored.length,
        revenueTargets: strategy.state.revenueFocus.length,
        trafficTargets: strategy.state.trafficFocus.length,
        contentTargets: strategy.state.contentFocus.length,
      },

      timestamp: new Date().toISOString(),
    };
  } catch (e) {
    return {
      success: false,
      version: "V6_AUTONOMOUS_COMPANY_OS",
      error: e?.message || "UNKNOWN_ERROR",
    };
  }
      }
