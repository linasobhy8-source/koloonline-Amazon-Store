export function trafficController(products = []) {
  return products
    .map((p) => {
      let trafficWeight = 1;

      const trendScore = p.trendScore || 0;
      const views = p.views || 0;

      /* ================= POSITIVE SIGNALS ================= */
      if (p.viralBoost) trafficWeight += 3;
      if (trendScore > 50) trafficWeight += 2;
      if (views > 1000) trafficWeight += 1;

      /* ================= NEGATIVE SIGNALS ================= */
      if (trendScore < 20) trafficWeight *= 0.5;

      return {
        ...p,
        trafficWeight,
      };
    })
    .sort((a, b) => b.trafficWeight - a.trafficWeight);
}
