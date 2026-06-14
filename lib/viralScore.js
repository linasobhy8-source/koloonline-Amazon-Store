export function viralScore(p) {
  let score = 0;

  // 🔥 التفاعل الأساسي
  score += (p.views || 0) * 0.5;
  score += (p.clicks || 0) * 2;
  score += (p.addToCart || 0) * 5;
  score += (p.orders || 0) * 10;

  // ⭐ الجودة
  score += (p.rating || 0) * 20;

  // 🚀 إشارات الانتشار
  if (p.shareCount > 10) score += 30;
  if (p.saveCount > 20) score += 20;

  // ⚡ trending boost
  if (p.trending === true) score += 50;

  // ❌ خصم المنتجات الضعيفة
  if (p.clicks < 5 && p.views > 100) score -= 20;

  return Math.max(0, Math.min(100, score));
}
