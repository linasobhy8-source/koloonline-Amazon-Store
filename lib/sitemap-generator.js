import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= SITE ================= */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

/* ================= NORMALIZE ================= */
const normalizeUrl = (url = "") =>
  url.replace("http://", "https://").replace("www.", "");

/* ================= BLOCKED PATHS ================= */
const EXCLUDED_PATHS = [
  "/contact",
  "/cart",
  "/dashboard",
  "/success",
  "/thankyou",
  "/search",
  "/admin",
  "/api",
];

/* ================= AI PRODUCT SCORE ================= */
function productScore(p = {}) {
  const rating = Number(p.rating) || 0;
  const orders = Number(p.orders) || 0;
  const views = Number(p.views) || 0;
  const clicks = Number(p.clicks) || 0;

  const ctr = views > 0 ? clicks / views : 0;

  return (
    rating * 12 +
    orders * 6 +
    views * 0.4 +
    ctr * 60 +
    (p.viralBoost ? 60 : 0)
  );
}

/* ================= AI INDEX GATE ================= */
function shouldIndexProduct(p = {}) {
  const title = (p.title || "").trim();
  const image = p.image;

  if (!title || title.length < 3) return false;
  if (!image) return false;

  const score = productScore(p);

  // 🔥 core filter (low quality exclusion)
  if (score < 30) return false;

  const views = Number(p.views) || 0;
  const clicks = Number(p.clicks) || 0;
  const orders = Number(p.orders) || 0;

  // dead products filter
  if (views === 0 && clicks === 0 && orders === 0) return false;

  return true;
}

/* ================= PRIORITY BOOST ================= */
function getPriorityFromProduct(p = {}) {
  const score = productScore(p);

  if (score >= 90) return 1.0;
  if (score >= 70) return 0.9;
  if (score >= 50) return 0.8;
  if (score >= 30) return 0.7;

  return 0.6;
}

/* ================= GLOBAL FILTER ================= */
function shouldInclude(url = "") {
  const lower = url.toLowerCase();

  if (!url) return false;

  if (EXCLUDED_PATHS.some((p) => lower.includes(p))) return false;
  if (lower.includes("?")) return false;
  if (lower.includes("/product/undefined")) return false;
  if (lower.endsWith("/product/")) return false;

  return true;
}

/* ================= SAFE DATE ================= */
function safeDate(date, fallback) {
  try {
    return date ? new Date(date).toISOString() : fallback;
  } catch {
    return fallback;
  }
}

/* ================= MAIN GENERATOR ================= */
export async function generateSitemap() {
  const now = new Date().toISOString();
  const urls = [];

  /* ================= PRODUCTS ================= */
  try {
    const productsSnap = await getDocs(collection(db, "products"));

    productsSnap.forEach((doc) => {
      const p = doc.data();

      // 🔥 AI GATE
      if (!shouldIndexProduct(p)) return;

      const loc = normalizeUrl(`${SITE_URL}/product/${p.slug || doc.id}`);

      if (!shouldInclude(loc)) return;

      urls.push({
        loc,
        lastmod: safeDate(p.updatedAt, now),
        changefreq: "daily",
        priority: getPriorityFromProduct(p),
      });
    });
  } catch (err) {
    console.error("Products sitemap error:", err);
  }

  /* ================= BLOG ================= */
  try {
    const blogSnap = await getDocs(collection(db, "blog"));

    blogSnap.forEach((doc) => {
      const post = doc.data();

      const title = (post.title || "").trim();
      if (!title) return;

      const loc = normalizeUrl(`${SITE_URL}/blog/${post.slug || doc.id}`);

      if (!shouldInclude(loc)) return;

      urls.push({
        loc,
        lastmod: safeDate(post.updatedAt, now),
        changefreq: "weekly",
        priority: 0.85,
      });
    });
  } catch (err) {
    console.error("Blog sitemap error:", err);
  }

  /* ================= STATIC PAGES ================= */
  const staticPages = [
    "",
    "/products",
    "/categories",
    "/blog",
    "/amazon-haul",
    "/
