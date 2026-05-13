export function calculateTrendScore(product) {
  const now = Date.now();

  // ================= SAFE DATE HANDLING =================
  const updatedAt =
    typeof product.updatedAt === "number"
      ? product.updatedAt
      : now;

  // ================= AGE =================
  const hoursOld = (now - updatedAt) / (1000 * 60 * 60);

  // ================= FRESHNESS BOOST =================
  // قوي في البداية ثم يقل تدريجيًا بدون ما ينتهي فجأة
  const freshnessBoost = Math.max(
    0,
    50 - Math.pow(hoursOld, 1.15)
  );

  // ================= ENGAGEMENT =================
  const clicks = product.clicks || 0;
  const views = product.views || 0;
  const score = product.score || 0;

  const engagement =
    clicks * 3 +
    views * 1 +
    score * 2;

  // ================= VIRAL BOOST =================
  const viralBoost = product.viralBoost ? 30 : 0;

  // ================= DECAY (منع التلاعب + استقرار الترتيب) =================
  const decayFactor = Math.log(hoursOld + 2);

  // ================= FINAL SCORE =================
  const trendScore =
    (engagement + freshnessBoost + viralBoost) / decayFactor;

  return trendScore;
}
