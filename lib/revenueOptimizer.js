export function revenueOptimizer(products = []) {
  if (!Array.isArray(products)) return [];

  return products
    .map((p) => {
      const price = Number(p.price || 0);
      const views = Number(p.views || 0);
      const clicks = Number(p.clicks || 0);

      const revenueScore = price * 0.4 + clicks * 0.4 + views * 0.2;

      return {
        ...p,
        revenueScore,
      };
    })
    .sort((a, b) => (b.revenueScore || 0) - (a.revenueScore || 0));
}
