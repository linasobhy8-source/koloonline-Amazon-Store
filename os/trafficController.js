export function trafficController(products = []) {
  return products
    .map((p) => {
      let weight = 1;

      if (p.viralBoost) weight += 3;
      if (p.trendScore > 50) weight += 2;
      if (p.views > 1000) weight += 1;

      if (p.trendScore < 20) weight *= 0.5;

      return {
        ...p,
        trafficWeight: weight,
      };
    })
    .sort((a, b) => b.trafficWeight - a.trafficWeight);
}
