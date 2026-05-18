export function calculateTrendScore(product) {
  const now = Date.now();

  // ================= SAFE DATE =================
  let updatedAt = now;

  try {
    if (product.updatedAt?.toDate) {
      updatedAt = product.updatedAt.toDate().getTime();
    } else if (typeof product.updatedAt === "number") {
      updatedAt = product.updatedAt;
    } else if (typeof product.updatedAt === "string") {
      updatedAt = new Date(product.updatedAt).getTime();
    }
  } catch {
    updatedAt = now;
  }

  // ================= AGE =================
  const hoursOld = Math.max(
    0,
    (now - updatedAt) / (1000 * 60 * 60)
  );

  // ================= FRESHNESS (SMOOTH CURVE) =================
  const freshnessBoost =
    40 * Math.exp(-hoursOld / 24); 
  // يقل تدريجي خلال يوم

  // ================= ENGAGEMENT =================
  const clicks = Number(product.clicks || 0);
  const views = Number(product.views || 0);
  const score = Number(product.score || 0);

  const ctr = views > 0 ? clicks / views : 0;

  const engagement =
    clicks * 2.5 +
    views * 0.8 +
    score * 2 +
    ctr * 50;

  // ================= VIRAL =================
  const viralBoost = product.viralBoost ? 35 : 0;

  // ================= DECAY (SAFE) =================
  const decay = Math.log(hoursOld + 3);

  // ================= FINAL =================
  const trendScore =
    (engagement + freshnessBoost + viralBoost) / decay;

  return Math.round(trendScore * 100) / 100;
}
