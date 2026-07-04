import { calculateTrendScore } from "./trendScore";

/* ================= AI INDEXING FILTER ================= */

export function shouldIndexProduct(product = {}) {
  if (!product || typeof product !== "object") return false;

  const title = (product.title || "").trim();
  const image = product.image || "";
  const price = Number(product.price);

  // 1) لازم بيانات أساسية
  if (!title || title.length < 3) return false;
  if (!image || typeof image !== "string") return false;
  if (!Number.isFinite(price) || price <= 0) return false;

  // 2) Trend score filter (الأهم)
  const score = calculateTrendScore(product);
  if (score < 25) return false;

  // 3) Engagement filter
  const views = Number(product.views) || 0;
  const clicks = Number(product.clicks) || 0;

  // لو مفيش أي تفاعل نهائي → تجاهل
  if (views === 0 && clicks === 0) return false;

  return true;
}

/* ================= PRIORITY CLASSIFIER ================= */

export function getIndexPriority(product = {}) {
  const score = calculateTrendScore(product);

  if (score >= 120) return 1.0;   // 🔥 Viral
  if (score >= 80) return 0.95;   // ⭐ High
  if (score >= 50) return 0.85;   // 👍 Good
  if (score >= 25) return 0.7;    // ⚠️ Acceptable

  return 0.0; // ❌ not indexable
}

/* ================= SAFE INDEXABLE LIST ================= */

export function filterIndexableProducts(products = []) {
  return products
    .filter((p) => shouldIndexProduct(p))
    .map((p) => ({
      ...p,
      indexPriority: getIndexPriority(p),
      trendScore: calculateTrendScore(p),
    }))
    .sort((a, b) => b.indexPriority - a.indexPriority);
}
