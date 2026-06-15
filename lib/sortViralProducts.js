export function viralScore(p = {}) {
  let score = 0;

  score += (Number(p.views) || 0) * 0.5;
  score += (Number(p.clicks) || 0) * 2;
  score += (Number(p.addToCart) || 0) * 5;
  score += (Number(p.orders) || 0) * 10;
  score += (Number(p.rating) || 0) * 20;

  if (p.trending === true) score += 50;
  if (p.viralBoost === true) score += 40;

  // حماية من القيم الغلط
  if (!isFinite(score)) score = 0;

  return Math.max(0, Math.min(100, score));
}

export function sortViral(products = []) {
  if (!Array.isArray(products)) return [];

  return products
    .map((p) => ({
      ...p,
      viralScore: viralScore(p),
    }))
    .sort((a, b) => (b.viralScore || 0) - (a.viralScore || 0));
}
