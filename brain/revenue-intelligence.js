export function calculateBrainScore({
  views = 0,
  clicks = 0,
  orders = 0,
  price = 0,
  weight = 1
}) {
  const safeViews = Number(views) || 0;
  const safeClicks = Number(clicks) || 0;
  const safeOrders = Number(orders) || 0;
  const safePrice = Number(price) || 0;

  const ctr = safeViews > 0 ? safeClicks / safeViews : 0;
  const cvr = safeClicks > 0 ? safeOrders / safeClicks : 0;
  const revenue = safeOrders * safePrice;

  // 🧠 تحسين الذكاء التجاري (Boost System)
  const score =
    revenue * 20 +        // أرباح مباشرة (أهم عنصر)
    ctr * 500 +           // جاذبية المنتج
    cvr * 1200 +          // قوة التحويل
    safeViews * 0.3;      // انتشار

  return score * weight;
}

/* ================= AUTO PROFIT BOOST ================= */
export function applyRevenueBoost(products = []) {
  return products.map((p) => {
    const score = calculateBrainScore({
      views: p.views,
      clicks: p.clicks,
      orders: p.orders || 0,
      price: p.price
    });

    return {
      ...p,
      brainScore: score,
      revenueScore: score, // unified ranking
      profitBoost: score > 1000
    };
  });
}

/* ================= SORT SYSTEM ================= */
export function rankByRevenue(products = []) {
  return [...products].sort(
    (a, b) => (b.revenueScore || 0) - (a.revenueScore || 0)
  );
}
