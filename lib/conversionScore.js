export function conversionScore(p) {
  const views = p.views || 0;
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;
  const price = p.price || 0;
  const score = p.score || 0;

  const ctr = views > 0 ? clicks / views : 0;
  const cvr = clicks > 0 ? orders / clicks : 0;

  // 🔥 Base conversion intelligence
  let conversion =
    ctr * 120 +
    cvr * 300 +
    score * 2 +
    orders * 15;

  // 💰 Price psychology (important)
  if (price >= 20 && price <= 80) conversion += 30; // sweet spot
  if (price > 150) conversion -= 20; // higher friction

  // 🔥 momentum boost
  if (p.viralBoost) conversion += 25;

  return Math.round(conversion);
}
