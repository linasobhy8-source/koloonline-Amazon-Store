/* ================= PRODUCT BRAIN v2 ================= */

export function productBrain(products = []) {
  if (!Array.isArray(products)) return [];

  return products.map((p) => {
    const views = Number(p?.views) || 0;
    const clicks = Number(p?.clicks) || 0;
    const orders = Number(p?.orders) || 0;
    const rating = Number(p?.rating) || 0;
    const price = Number(p?.price) || 0;

    /* ================= CORE METRICS ================= */

    const ctr = views > 0 ? clicks / views : 0;
    const conv = clicks > 0 ? orders / clicks : 0;

    /* ================= TIME DECAY ================= */

    let ageFactor = 1;

    try {
      const created = p?.createdAt?.toDate
        ? p.createdAt.toDate().getTime()
        : new Date(p?.createdAt || Date.now()).getTime();

      const hoursOld = Math.max(
        0,
        (Date.now() - created) / (1000 * 60 * 60)
      );

      ageFactor = 1 / Math.log(hoursOld + 3);
    } catch {
      ageFactor = 1;
    }

    /* ================= BASE SCORE ================= */

    let score =
      ctr * 140 +
      conv * 300 +
      rating * 25 +
      (p?.viralBoost ? 120 : 0) +
      (price < 50 ? 25 : 0) +
      (views > 100 ? 15 : 0) +
      (orders > 10 ? 40 : 0);

    /* ================= PENALTIES (IMPORTANT) ================= */

    if (!p?.title || p.title.length < 3) score *= 0.3;
    if (!p?.image) score *= 0.4;
    if (views === 0 && clicks === 0 && orders === 0) score *= 0.2;

    /* ================= FINAL ADJUSTMENT ================= */

    score = score * ageFactor;

    if (!isFinite(score)) score = 0;

    /* ================= CLASSIFICATION ================= */

    return {
      ...p,

      score: Math.round(score),

      isWinner: score >= 180,
      isBoosted: score >= 300,
      isElite: score >= 500,

      tier:
        score >= 500
          ? "elite"
          : score >= 300
          ? "high"
          : score >= 180
          ? "medium"
          : "low",
    };
  });
  }
