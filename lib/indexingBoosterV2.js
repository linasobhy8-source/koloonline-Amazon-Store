import { calculateTrendScore } from "./trendScore";

/* ================= BOOSTER RULES ================= */

function engagementScore(p = {}) {
  const views = Number(p.views) || 0;
  const clicks = Number(p.clicks) || 0;
  const orders = Number(p.orders) || 0;

  const ctr = views > 0 ? clicks / views : 0;

  return views * 0.5 + clicks * 2 + orders * 6 + ctr * 50;
}

/* ================= CORE DECISION ENGINE ================= */

export function shouldIndex(p = {}) {
  if (!p || typeof p !== "object") return false;

  const title = (p.title || "").trim();
  const image = p.image;

  if (!title || title.length < 3) return false;
  if (!image) return false;

  const trend = calculateTrendScore(p);
  const engagement = engagementScore(p);

  /* ================= HARD RULES ================= */

  // ❌ منتجات ميتة
  if (engagement === 0) return false;

  // ❌ ضعيف جدًا
  if (trend < 30) return false;

  return true;
}

/* ================= PRIORITY ENGINE ================= */

export function getIndexPriority(p = {}) {
  const trend = calculateTrendScore(p);

  if (trend >= 150) return 1.0;   // 🔥 Viral
  if (trend >= 100) return 0.95;  // ⭐ Hot
  if (trend >= 70) return 0.9;    // 👍 Strong
  if (trend >= 40) return 0.8;    // ⚡ Medium
  if (trend >= 30) return 0.7;    // ⚠️ Low-pass

  return 0.0; // ❌ not indexable
}

/* ================= BOOST LABEL ================= */

export function getBoostLabel(p = {}) {
  const trend = calculateTrendScore(p);

  if (trend >= 150) return "viral";
  if (trend >= 100) return "hot";
  if (trend >= 70) return "strong";
  if (trend >= 40) return "medium";
  if (trend >= 30) return "low";

  return "blocked";
}
