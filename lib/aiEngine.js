export function aiScore(product = {}) {
  let score = 0;

  // ===== SEO =====
  if (product.title) {
    const t = product.title.toLowerCase();

    if (t.length > 15) score += 10;
    if (t.includes("best")) score += 15;
    if (t.includes("pro") || t.includes("2026")) score += 10;
  }

  if (product.description && product.description.length > 120) {
    score += 15;
  }

  // ===== ENGAGEMENT =====
  score += (product.views || 0) * 0.5;
  score += (product.clicks || 0) * 2;
  score += (product.orders || 0) * 5;

  // ===== TRUST =====
  if (product.rating >= 4.5) score += 25;
  if (product.rating >= 4.0) score += 15;

  // ===== TREND =====
  if (product.trending) score += 40;
  if (product.viralBoost) score += 60;

  // ===== STOCK =====
  if (product.inStock === false) score -= 50;

  return score;
}

/* ================= GLOBAL AI DECISION ================= */
export function aiDecision(product = {}, context = "default") {
  const score = aiScore(product);

  let include = true;
  let priority = 0.7;
  let visibility = "normal"; // hidden | normal | featured

  // ===== RULE ENGINE =====
  if (score < 30) {
    include = false;
    visibility = "hidden";
  }

  if (score >= 30) priority = 0.6;
  if (score >= 60) priority = 0.75;
  if (score >= 100) priority = 0.9;
  if (score >= 160) priority = 1.0;

  if (score >= 120) visibility = "featured";

  // ===== CONTEXT OVERRIDES =====
  if (context === "homepage") {
    include = score >= 50;
  }

  if (context === "sitemap") {
    include = score >= 40;
  }

  if (context === "ranking") {
    include = true;
  }

  return {
    include,
    priority,
    visibility,
    score,
  };
  }
