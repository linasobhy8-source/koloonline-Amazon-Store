
export function revenueOptimizer(products) {
  return products.map((p) => {
    const price = Number(p.price || 0);
    const orders = Number(p.orders || 0);
    const clicks = Number(p.clicks || 0);
    const views = Number(p.views || 1);

    /* ================= BASE SCORE ================= */
    const ctr = clicks / views;        // نسبة الضغط
    const cvr = orders / clicks || 0;   // نسبة الشراء

    let boost = 1;

    /* ================= SALES POWER ================= */
    if (orders > 10) boost += 0.5;
    if (orders > 50) boost += 1; // 🔥 منتجات قوية جدًا

    /* ================= PRICE POWER ================= */
    if (price > 50) boost += 0.3;
    if (price > 100) boost += 0.6; // CPM أعلى

    /* ================= VIRAL BOOST ================= */
    if (p.viralBoost) boost += 1;

    /* ================= ENGAGEMENT BOOST ================= */
    if (ctr > 0.1) boost += 0.4;
    if (cvr > 0.05) boost += 0.6;

    /* ================= FINAL REVENUE SCORE ================= */
    const revenueScore =
      (p.aiScore || 0) * boost +
      orders * 2 +
      ctr * 50 +
      cvr * 100;

    return {
      ...p,
      ctr,
      cvr,
      boost,
      revenueScore,
    };
  });
  }
