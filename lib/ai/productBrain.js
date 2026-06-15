export function productBrain(products = []) {
  if (!Array.isArray(products)) return [];

  return products.map((p) => {
    const views = Number(p?.views) || 0;
    const clicks = Number(p?.clicks) || 0;
    const orders = Number(p?.orders) || 0;
    const price = Number(p?.price) || 0;

    const ctr = views > 0 ? clicks / views : 0;
    const conv = clicks > 0 ? orders / clicks : 0;

    let score =
      ctr * 120 +
      conv * 250 +
      (p?.viralBoost ? 100 : 0) +
      (price < 50 ? 20 : 0);

    if (!isFinite(score)) score = 0;

    return {
      ...p,
      score,
      isWinner: score > 150,
      isBoosted: score > 250,
    };
  });
}
