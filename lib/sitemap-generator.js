import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// ================= FIREBASE =================
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app =
  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

const db = getFirestore(app);

// ================= SITE =================
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://koloonline.online";

// ================= NORMALIZE =================
const normalizeUrl = (url) =>
  url.replace("http://", "https://").replace("www.", "");

// ================= BLOCKED =================
const EXCLUDED_PATHS = [
  "/contact",
  "/cart",
  "/dashboard",
  "/success",
  "/thankyou",
  "/search",
  "/admin",
];

// ================= AI PRODUCT SCORE =================
function productScore(p = {}) {
  const rating = Number(p.rating) || 0;
  const orders = Number(p.orders) || 0;
  const views = Number(p.views) || 0;
  const clicks = Number(p.clicks) || 0;

  const ctr = views > 0 ? clicks / views : 0;

  return (
    rating * 10 +
    orders * 5 +
    views * 0.3 +
    ctr * 50 +
    (p.viralBoost ? 50 : 0)
  );
}

// ================= AI INDEX FILTER =================
function shouldIndexProduct(p = {}) {
  const title = (p.title || "").trim();
  const image = p.image;

  if (!title || title.length < 3) return false;
  if (!image) return false;

  const score = productScore(p);
  if (score < 25) return false;

  const views = Number(p.views) || 0;
  const clicks = Number(p.clicks) || 0;

  // لو مفيش أي نشاط = تجاهل
  if (views === 0 && clicks === 0) return false;

  return true;
}

// ================= FILTER =================
function shouldInclude(url = "") {
  if (!url) return false;

  const lower = url.toLowerCase();

  if (EXCLUDED_PATHS.some((p) => lower.includes(p))) return false;
  if (lower.includes("?")) return false;
  if (lower.includes("/product/undefined")) return false;
  if (lower.endsWith("/product/")) return false;

  return true;
}

// ================= PRIORITY =================
function getPriority(url) {
  if (url.includes("/product/")) return 1.0;
  if (url.includes("/blog/")) return 0.85;
  if (url.includes("/top/")) return 0.9;
  if (url.includes("/category/")) return 0.8;
  if (url === SITE_URL + "/") return 1.0;
  return 0.6;
}

// ================= SAFE DATE =================
function safeDate(date, fallback) {
  try {
    return date ? new Date(date).toISOString() : fallback;
  } catch {
    return fallback;
  }
}

// ================= GENERATOR =================
export async function generateSitemap() {
  const now = new Date().toISOString();
  const urls = [];

  // ================= PRODUCTS (AI FILTERED) =================
  try {
    const productsSnap = await getDocs(collection(db, "products"));

    productsSnap.forEach((doc) => {
      const p = doc.data();

      // 🔥 AI FILTER (MAIN GATE)
      if (!shouldIndexProduct(p)) return;

      const loc = normalizeUrl(
        `${SITE_URL}/product/${p.slug || doc.id}`
      );

      if (!shouldInclude(loc)) return;

      urls.push({
        loc,
        lastmod: safeDate(p.updatedAt, now),
        changefreq: "daily",
        priority: 1.0,
      });
    });
  } catch (err) {
    console.error("Products sitemap:", err);
  }

  // ================= BLOG =================
  try {
    const blogSnap = await getDocs(collection(db, "blog"));

    blogSnap.forEach((doc) => {
      const post = doc.data();

      const loc = normalizeUrl(
        `${SITE_URL}/blog/${post.slug || doc.id}`
      );

      if (!shouldInclude(loc)) return;

      urls.push({
        loc,
        lastmod: safeDate(post.updatedAt, now),
        changefreq: "weekly",
        priority: 0.85,
      });
    });
  } catch (err) {
    console.error("Blog sitemap:", err);
  }

  // ================= STATIC =================
  const staticPages = [
    "",
    "/products",
    "/categories",
    "/blog",
    "/amazon-haul",
    "/about",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/top/top-smart-watches",
    "/top/top-earbuds",
  ];

  staticPages.forEach((page) => {
    const loc = normalizeUrl(`${SITE_URL}${page}`);

    if (!shouldInclude(loc)) return;

    urls.push({
      loc,
      lastmod: now,
      changefreq: "weekly",
      priority: getPriority(loc),
    });
  });

  // ================= DEDUP =================
  const uniqueUrls = Array.from(
    new Map(urls.map((item) => [item.loc, item])).values()
  );

  uniqueUrls.sort((a, b) => b.priority - a.priority);

  // ================= XML =================
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${uniqueUrls
  .map(
    (u) => `
<url>
  <loc>${u.loc}</loc>
  <lastmod>${u.lastmod}</lastmod>
  <changefreq>${u.changefreq}</changefreq>
  <priority>${u.priority}</priority>
</url>`
  )
  .join("")}

</urlset>`;
    }
