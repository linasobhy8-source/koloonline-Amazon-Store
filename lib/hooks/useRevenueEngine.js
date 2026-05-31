import { useMemo } from "react";

/* ================= REVENUE ENGINE HOOK ================= */
export function useRevenueEngine(product, allProducts = []) {
  return useMemo(() => {
    if (!product) return null;

    const price = Number(product.price || 0);
    const clicks = product.clicks || 0;
    const orders = product.orders || 0;
    const views = product.views || 0;

    const ctr = views ? clicks / views : 0;
    const conv = clicks ? orders / clicks : 0;

    const revenue = orders * price;

    /* ================= SCORE ================= */
    const score =
      views * 0.2 +
      clicks * 1.5 +
      orders * 5 +
      ctr * 120 +
      conv * 180 +
      revenue * 0.3 +
      (product.viralBoost ? 100 : 0);

    /* ================= UPSells ================= */
    const upsells = allProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          Number(p.price || 0) > price
      )
      .sort((a, b) => (b.orders || 0) - (a.orders || 0))
      .slice(0, 3);

    /* ================= CHEAPER OPTIONS ================= */
    const cheaper = allProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          Number(p.price || 0) < price
      )
      .slice(0, 3);

    /* ================= URGENCY ================= */
    let urgency = "⚡ Standard Deal";

    if (score > 2000) {
      urgency = "🔥 HIGH CONVERSION PRODUCT";
    } else if (conv > 0.2) {
      urgency = "⏳ High Demand - Limited Stock";
    } else if (product.viralBoost) {
      urgency = "🚀 Viral Trending Product";
    }

    return {
      score,
      revenue,
      ctr,
      conv,
      urgency,
      upsells,
      cheaper,
    };
  }, [product, allProducts]);
}
