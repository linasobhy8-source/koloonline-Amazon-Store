import { useMemo } from "react";

/* ================= REVENUE ENGINE HOOK ================= */
export function useRevenueEngine(product, allProducts = []) {
  return useMemo(() => {
    if (!product || typeof product !== "object") return null;

    const price = Number(product.price) || 0;
    const clicks = Number(product.clicks) || 0;
    const orders = Number(product.orders) || 0;
    const views = Number(product.views) || 0;

    const ctr = views > 0 ? clicks / views : 0;
    const conv = clicks > 0 ? orders / clicks : 0;

    const revenue = orders * price;

    /* ================= SCORE ================= */
    let score =
      views * 0.2 +
      clicks * 1.5 +
      orders * 5 +
      ctr * 120 +
      conv * 180 +
      revenue * 0.3 +
      (product.viralBoost ? 100 : 0);

    if (!isFinite(score)) score = 0;

    /* ================= UPSells ================= */
    const upsells = (Array.isArray(allProducts) ? allProducts : [])
      .filter(
        (p) =>
          p &&
          p.id !== product.id &&
          Number(p.price) > price
      )
      .sort((a, b) => (Number(b.orders) || 0) - (Number(a.orders) || 0))
      .slice(0, 3);

    /* ================= CHEAPER OPTIONS ================= */
    const cheaper = (Array.isArray(allProducts) ? allProducts : [])
      .filter(
        (p) =>
          p &&
          p.id !== product.id &&
          Number(p.price) < price
      )
      .slice(0, 3);

    /* ================= URGENCY ================= */
    let urgency = "⚡ Standard Deal";

    if (score > 2000) {
      urgency = "🔥 HIGH CONVERSION PRODUCT";
    } else if (conv > 0.2) {
      urgency = "⏳ High Demand - Limited Stock";
    } else if (product.viralBoost === true) {
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
