export function autonomousEngine(products) {
  return products
    .map(p => {
      const views = p.views || 0;
      const clicks = p.clicks || 0;
      const orders = p.orders || 0;

      const ctr = views ? clicks / views : 0;
      const conv = clicks ? orders / clicks : 0;

      const viral = p.viralBoost ? 2 : 1;

      const freshness = p.createdAt
        ? Math.max(0, 1 - (Date.now() - p.createdAt) / 86400000)
        : 0.5;

      const score =
        views * 0.15 +
        clicks * 1.8 +
        orders * 6 +
        ctr * 120 +
        conv * 200 +
        freshness * 50;

      return {
        ...p,
        aiScore: score * viral
      };
    })
    .sort((a, b) => b.aiScore - a.aiScore);
}
