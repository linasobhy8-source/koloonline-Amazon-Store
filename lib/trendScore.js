/* ================= TREND SCORE ENGINE (CLEAN) ================= */

export function calculateTrendScore(product = {}) {
  const now = Date.now();

  /* ================= SAFE DATE ================= */
  let updatedAt = now;

  try {
    if (product?.updatedAt?.toDate) {
      updatedAt = product.updatedAt.toDate().getTime();
    } else if (typeof product.updatedAt === "number") {
      updatedAt = product.updatedAt;
    } else if (typeof product.updatedAt === "string") {
      const parsed = Date.parse(product.updatedAt);
      updatedAt = Number.isNaN(parsed) ? now : parsed;
    }
  } catch {
    updatedAt = now;
  }

  /* ================= AGE ================= */
  const hoursOld = Math.max(
    0,
    (now - updatedAt) / (1000 * 60 * 60)
  );

  /* ================= SAFE NUMBERS ================= */
  const clicks = Number(product.clicks) || 0;
  const views = Number(product.views) || 0;
  const orders = Number(product.orders) || 0;
  const score = Number(product.score) || 0;

  const ctr = views > 0 ? clicks / views : 0;

  /* ================= ENGAGEMENT ================= */
  const engagement =
    clicks * 2.5 +
    views * 0.8 +
    orders * 6 +
    score * 2 +
    ctr * 50;

  /* ================= FRESHNESS ================= */
  const freshnessBoost = 40 * Math.exp(-hoursOld / 24);

  /* ================= VIRAL BOOST ================= */
  const viralBoost = product.viralBoost ? 35 : 0;

  /* ================= SAFE DECAY ================= */
  const decay = Math.log(hoursOld + 3);

  /* ================= FINAL SCORE ================= */
  const trendScore =
    (engagement + freshnessBoost + viralBoost) / decay;

  return Number.isFinite(trendScore)
    ? Math.round(trendScore)
    : 0;
}
