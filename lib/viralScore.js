export function viralScore(product = {}) {
  const views = Number(product.views) || 0;
  const clicks = Number(product.clicks) || 0;
  const orders = Number(product.orders) || 0;
  const rating = Number(product.rating) || 0;

  const ctr = views > 0 ? clicks / views : 0;

  let score =
    rating * 10 +
    orders * 5 +
    views * 0.2 +
    ctr * 50;

  if (product.viralBoost) score += 60;

  return Math.round(score);
}
