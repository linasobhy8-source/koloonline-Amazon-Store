import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= AMAZON LEVEL AI ================= */
export async function amazonScore(user, product, analytics, relations) {
  let score = 0;

  const pAnalytics = analytics[product.asin] || {};

  const clicks = pAnalytics.clicks || 0;
  const orders = pAnalytics.orders || 0;

  /* ================= 1. PERSONAL AI ================= */
  if (user.views?.includes(product.asin)) score += 3;
  if (user.clicks?.includes(product.asin)) score += 6;
  if (user.purchases?.includes(product.asin)) score += 12;
  if (user.categories?.includes(product.category)) score += 4;

  /* ================= 2. GLOBAL POPULARITY ================= */
  score += clicks * 0.5;
  score += orders * 3;

  /* ================= 3. AMAZON BEHAVIOR AI ================= */
  const rel = relations[product.asin] || {};

  if (rel.alsoViewed?.length) {
    if (user.views?.some(v => rel.alsoViewed.includes(v))) {
      score += 4;
    }
  }

  if (rel.boughtTogether?.length) {
    if (user.purchases?.some(p => rel.boughtTogether.includes(p))) {
      score += 8;
    }
  }

  /* ================= 4. PRICE INTELLIGENCE ================= */
  const price = Number(product.price) || 0;
  if (price < 50) score += 3;
  if (price < 20) score += 4;

  /* ================= 5. NEW PRODUCT BOOST ================= */
  if (!clicks && !orders) score += 2;

  return score;
}
