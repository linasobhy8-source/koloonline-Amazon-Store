export function revenueOptimizer(products = []) {
  return products
    .map((p) => {
      const views = p.views || 0;
      const clicks = p.clicks || 0;
      const orders = p.orders || 0;

      const ctr = views > 0 ? clicks / views : 0;
      const cvr = clicks > 0 ? orders / clicks : 0;

      let revenueScore =
        (p.price || 0) * cvr * 10 +
        ctr * 80 +
        (p.viralBoost ? 50 : 0);

      return {
        ...p,
        revenueScore,
      };
    })
    .sort((a, b) => b.revenueScore - a.revenueScore);
}
