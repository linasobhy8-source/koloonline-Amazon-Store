/* ================= DYNAMIC PRICING AI ================= */
export async function pricingEngine(products) {
  return products.map(p => {
    const demand = p.salesVelocity || 0;

    let priceMultiplier = 1;

    if (demand > 2000) priceMultiplier = 1.2;
    else if (demand > 1000) priceMultiplier = 1.1;
    else priceMultiplier = 0.95;

    return {
      ...p,
      optimizedPrice: Math.round(p.price * priceMultiplier),
      profitScore: demand * priceMultiplier
    };
  });
}
