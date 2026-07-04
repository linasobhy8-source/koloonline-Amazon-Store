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

// ================= SEO RULES =================

// صفحات ممنوعة من الفهرسة (مهم جدًا لحل Crawled not indexed)
const EXCLUDED_PATHS = [
  "/contact",
  "/cart",
  "/dashboard",
  "/success",
  "/thankyou",
  "/search",
  "/admin",
];

// صفحات ضعيفة القيمة
function shouldInclude(url = "") {
  const lower = url.toLowerCase();

  if (EXCLUDED_PATHS.some((p) => lower.includes(p))) return false;

  if (lower.includes("?")) return false;

  return true;
}

// ================= PRIORITY ENGINE =================
function getPriority(url) {
  if (url.includes("/product/")) return 1.0;
  if (url.includes("/blog/")) return 0.85;
  if (url.includes("/top/")) return 0.9;
  if (url.includes("/category/")) return 0.8;
  if (url === SITE_URL + "/") return 1.0;
  return 0.6;
}

// ================= LASTMOD SAFE =================
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

  // ================= PRODUCTS =================
  try {
    const productsSnap = await getDocs(collection(db, "products"));

    productsSnap.forEach((doc) => {
      const p = doc.data();

      const loc = `${SITE_URL}/product/${p.slug || doc.id}`;

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

      const loc = `${SITE_URL}/blog/${post.slug || doc.id}`;

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

  // ================= STATIC PAGES =================
  const staticPages = [
    "",
    "/products",
    "/categories",
    "/blog",
    "/amazon-haul",
    "/audible",
    "/aliexpress",
    "/fiverr",
    "/about",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/top/top-smart-watches",
    "/top/top-earbuds",
    "/top/top-smart-watches-under-100",
  ];

  staticPages.forEach((page) => {
    const loc = `${SITE_URL}${page}`;

    if (!shouldInclude(loc)) return;

    urls.push({
      loc,
      lastmod: now,
      changefreq: "weekly",
      priority: getPriority(loc),
    });
  });

  // ================= REMOVE DUPLICATES =================
  const uniqueUrls = Array.from(
    new Map(urls.map((item) => [item.loc, item])).values()
  );

  uniqueUrls.sort((a, b) => b.priority - a.priority);

  // ================= BUILD XML =================
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
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

  return xml;
        }
