export function productBrain(products) {
  return products.map(p => {
    const ctr = p.views ? p.clicks / p.views : 0;
    const conv = p.clicks ? p.orders / p.clicks : 0;

    const score =
      ctr * 120 +
      conv * 250 +
      (p.viralBoost ? 100 : 0) +
      (p.price < 50 ? 20 : 0);

    return {
      ...p,
      score,
      isWinner: score > 150,
      isBoosted: score > 250,
    };
  });
}
