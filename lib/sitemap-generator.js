import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// ================= FIREBASE =================
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig);

const db = getFirestore(app);

// ================= SITE =================
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://koloonline.online";

// ================= GENERATOR =================
export async function generateSitemap() {
  const now = new Date().toISOString();

  const urls = [];

  // ================= PRODUCTS =================
  try {
    const productsSnap = await getDocs(collection(db, "products"));

    productsSnap.forEach((doc) => {
      const p = doc.data();

      urls.push({
        loc: `${SITE_URL}/product/${p.slug || doc.id}`,
        lastmod: p.updatedAt
          ? new Date(p.updatedAt).toISOString()
          : now,
        changefreq: "daily",
        priority: 0.9,
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

      urls.push({
        loc: `${SITE_URL}/blog/${post.slug || doc.id}`,
        lastmod: post.updatedAt
          ? new Date(post.updatedAt).toISOString()
          : now,
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
    "/search",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/top/top-smart-watches",
    "/top/top-earbuds",
    "/top/top-smart-watches-under-100",
  ];

  staticPages.forEach((page) => {
    urls.push({
      loc: `${SITE_URL}${page}`,
      lastmod: now,
      changefreq: "weekly",
      priority:
        page === ""
          ? 1.0
          : page.startsWith("/top/")
          ? 0.9
          : 0.8,
    });
  });
    // ================= REMOVE DUPLICATES =================
  const uniqueUrls = Array.from(
    new Map(urls.map((item) => [item.loc, item])).values()
  );

  uniqueUrls.sort((a, b) => a.loc.localeCompare(b.loc));

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
