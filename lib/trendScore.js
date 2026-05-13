export function calculateTrendScore(product) {
  const now = Date.now();
  const updatedAt = product.updatedAt || now;

  // عمر المنتج بالساعات
  const hoursOld = (now - updatedAt) / (1000 * 60 * 60);

  // 🔥 Boost للمنتج الجديد (أول 48 ساعة)
  const freshnessBoost = Math.max(0, 50 - hoursOld * 1.2);

  // 📊 التفاعل
  const engagement =
    (product.clicks || 0) * 3 +
    (product.views || 0) * 1 +
    (product.score || 0) * 2;

  // 🔥 viral flag
  const viralBoost = product.viralBoost ? 30 : 0;

  return engagement + freshnessBoost + viralBoost;
}
