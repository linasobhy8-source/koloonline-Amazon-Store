export function detectVirals(products) {
  return products.filter(p => {
    const ctr = p.views ? p.clicks / p.views : 0;

    return (
      ctr > 0.08 ||
      p.clicks > 100 ||
      p.viralBoost === true
    );
  });
}
