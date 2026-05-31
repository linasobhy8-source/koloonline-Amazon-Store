/* ================= PROFIT ENGINE ================= */
export async function profitRouter(decisions, traffic, ads) {
  const revenue =
    decisions.length * traffic.traffic * 0.02;

  return {
    estimatedRevenue: revenue,
    roi: revenue / (ads.length * 100 || 1),
    status: revenue > 1000 ? "SCALING" : "OPTIMIZING"
  };
}
