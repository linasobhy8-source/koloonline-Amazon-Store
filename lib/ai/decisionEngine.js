/* ================= DECISION MAKER ================= */
export async function decisionEngine(market) {
  return market.trendingProducts.map(p => ({
    ...p,
    action: p.demand > 0.8 ? "SCALE" : "TEST",
    budget: p.demand * 100
  }));
}
