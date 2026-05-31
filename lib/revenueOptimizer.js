export function revenueOptimizer(products) {
  return products.map(p => {
    const price = Number(p.price || 0);

    let boost = 1;

    // المنتجات اللي بتبيع أكتر = boost
    if ((p.orders || 0) > 10) boost += 0.5;

    // المنتجات الغالية = CPM أعلى
    if (price > 50) boost += 0.3;

    // viral boost
    if (p.viralBoost) boost += 1;

    return {
      ...p,
      revenueScore: (p.aiScore || 0) * boost
    };
  });
}
