// lib/revenueEngine.js

export function revenueEngine(products = []) {
  if (!Array.isArray(products)) return [];

  return products
    .map((p) => {
      const views = Number(p.views || 0);
      const clicks = Number(p.clicks || 0);
      const price = Number(p.price || 0);

      const viral = p.viralBoost ? 2 : 1;

      // CTR approximation
      const ctr = views > 0 ? clicks / views : 0;

      // 💰 Revenue Score (core logic)
      const revenueScore =
        (views * ctr * 2) +
        (clicks * 3) +
        (price * 0.05) +
        viral;

      return {
        ...p,
        ctr,
        revenueScore,
      };
    })
    .sort((a, b) => b.revenueScore - a.revenueScore);
}
