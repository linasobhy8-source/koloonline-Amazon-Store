export async function portfolioManager(market, competitors) {
  const products = market.market || [];

  return products.map(p => {
    const competitorPressure = Math.random() * 100;

    return {
      ...p,
      score:
        (p.trendScore || 0) -
        competitorPressure +
        (p.viralBoost ? 50 : 0),

      status:
        p.views > 1000 ? "STRONG" : "WEAK"
    };
  });
}
