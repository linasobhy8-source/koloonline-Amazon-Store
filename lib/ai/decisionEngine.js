export function decisionEngine(products = []) {
  return products
    .map(p => ({
      ...p,
      score:
        (p.views || 0) * 0.2 +
        (p.clicks || 0) * 1 +
        (p.orders || 0) * 5,
    }))
    .sort((a, b) => b.score - a.score);
}
