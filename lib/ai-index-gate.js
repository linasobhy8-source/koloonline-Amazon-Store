/* ================= AI INDEX GATE (CENTRAL DECISION ENGINE) ================= */

/**
 * الهدف:
 * - تحديد هل المنتج/المحتوى يدخل sitemap
 * - هل يتبعت IndexNow
 * - هل يظهر في trending
 * - تحديد priority للفهرسة
 */

/* ================= SAFE HELPERS ================= */
const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeText = (v) => {
  if (!v) return "";
  return String(v).trim();
};

/* ================= PRODUCT SCORING ================= */
export function calculateIndexScore(p = {}) {
  const rating = safeNumber(p.rating);
  const views = safeNumber(p.views);
  const clicks = safeNumber(p.clicks);
  const orders = safeNumber(p.orders);
  const score = safeNumber(p.score);

  const ctr = views > 0 ? clicks / views : 0;

  const base =
    rating * 10 +
    views * 0.3 +
    clicks * 0.8 +
    orders * 6 +
    score * 2 +
    ctr * 50;

  const viralBoost = p.viralBoost ? 40 : 0;

  return base + viralBoost;
}

/* ================= CORE DECISION ================= */
export function shouldIndexProduct(product = {}) {
  const title = safeText(product.title);
  const image = product.image;

  // ❌ missing essential data
  if (!title || title.length < 3) return false;
  if (!image) return false;

  // ❌ no activity
  if (
    safeNumber(product.views) === 0 &&
    safeNumber(product.clicks) === 0
  ) {
    return false;
  }

  const score = calculateIndexScore(product);

  // 🔥 threshold (main gate)
  if (score < 25) return false;

  return true;
}

/* ================= PRIORITY ENGINE ================= */
export function getIndexPriority(product = {}) {
  const score = calculateIndexScore(product);

  if (score >= 120) return 1.0;   // viral product
  if (score >= 80) return 0.9;    // strong product
  if (score >= 50) return 0.8;    // good product
  if (score >= 25) return 0.7;    // weak but acceptable

  return 0.5;
}

/* ================= INDEX ACTION DECISION ================= */
export function shouldSubmitToIndexNow(product = {}) {
  const score = calculateIndexScore(product);

  // فقط المنتجات القوية يتم إرسالها فوراً
  if (score >= 50) return true;

  return false;
}

/* ================= SITEMAP DECISION ================= */
export function shouldIncludeInSitemap(product = {}) {
  return shouldIndexProduct(product);
}

/* ================= TREND ELIGIBILITY ================= */
export function shouldShowInTrending(product = {}) {
  const score = calculateIndexScore(product);

  return score >= 40;
}

/* ================= FULL DECISION EXPORT ================= */
export function getIndexDecision(product = {}) {
  const score = calculateIndexScore(product);

  return {
    score,
    index: shouldIndexProduct(product),
    sitemap: shouldIncludeInSitemap(product),
    indexNow: shouldSubmitToIndexNow(product),
    trending: shouldShowInTrending(product),
    priority: getIndexPriority(product),
  };
}
