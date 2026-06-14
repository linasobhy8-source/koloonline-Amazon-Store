export function viralScore(p) {
  let score = 0;

  score += (p.views || 0) * 0.5;
  score += (p.clicks || 0) * 2;
  score += (p.addToCart || 0) * 5;
  score += (p.orders || 0) * 10;
  score += (p.rating || 0) * 20;

  if (p.trending) score += 50;
  if (p.viralBoost) score += 40;

  return Math.max(0, Math.min(100, score));
}

export function sortViral(products) {
  return products
    .map((p) => ({
      ...p,
      viralScore: viralScore(p),
    }))
    .sort((a, b) => b.viralScore - a.viralScore);
}
