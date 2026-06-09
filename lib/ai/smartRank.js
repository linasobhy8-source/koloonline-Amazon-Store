export function smartRank(products = []) {
  return products
    .map((p) => ({
      ...p,
      score:
        (p.score || 0) +
        (p.views || 0) * 0.1 +
        (p.clicks || 0) * 0.5 +
        (p.viralBoost ? 50 : 0),
    }))
    .sort((a, b) => b.score - a.score);
}
