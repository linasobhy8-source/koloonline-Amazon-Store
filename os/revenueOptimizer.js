export function revenueOptimizer(products = []) {
  return products
    .map((p) => {
      const ctr = p.clicks / (p.views || 1);
      const cvr = p.orders / (p.clicks || 1);

      let score =
        (p.price || 0) * cvr * 10 +
        ctr * 80 +
        (p.viralBoost ? 50 : 0);

      return {
        ...p,
        revenueScore: score,
      };
    })
    .sort((a, b) => b.revenueScore - a.revenueScore);
}
