/* ================= SMART TRAFFIC DISTRIBUTION ================= */
export async function trafficRouter(products) {
  const top = products
    .sort((a, b) => b.profitScore - a.profitScore)
    .slice(0, 5);

  return {
    boosted: top.map(p => p.title),
    strategy: "high-intent users → high-profit products"
  };
}
