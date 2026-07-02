import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// ================= FIREBASE INIT =================
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app =
  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

const db = getFirestore(app);

// ================= SITE URL =================
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

// ================= HANDLER =================
export default async function handler(req, res) {
  try {
    const now = new Date().toISOString();
    const urls = [];

    // ================= PRODUCTS =================
    const productsSnap = await getDocs(collection(db, "products"));

    productsSnap.forEach((doc) => {
      const p = doc.data();
      const slug = p?.slug || doc.id;

      urls.push({
        loc: `${SITE_URL}/product/${slug}`,
        lastmod: p?.updatedAt
          ? new Date(p.updatedAt).toISOString()
          : now,
        changefreq: "daily",
        priority: 0.9,
      });
    });

    // ================= BLOG =================
    const blogSnap = await getDocs(collection(db, "blog"));

    blogSnap.forEach((doc) => {
      const post = doc.data();
      const slug = post?.slug || doc.id;

      urls.push({
        loc: `${SITE_URL}/blog/${slug}`,
        lastmod: post?.updatedAt
          ? new Date(post.updatedAt).toISOString()
          : now,
        changefreq: "monthly",
        priority: 0.85,
      });
    });

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
      "/top/top-smart-watches",
      "/top/top-earbuds",
      "/top/top-smart-watches-under-100",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      "/disclaimer",
    ];

    staticPages.forEach((page) => {
      urls.push({
        loc: `${SITE_URL}${page}`,
        lastmod: now,
        changefreq: "weekly",
        priority: page === "" ? 1.0 : page.startsWith("/top/") ? 0.9 : 0.8,
      });
    });

    // ================= REMOVE DUPLICATES =================
    const uniqueUrls = Array.from(
      new Map(urls.map((u) => [u.loc, u])).values()
    );

    uniqueUrls.sort((a, b) => a.loc.localeCompare(b.loc));

    // ================= XML =================
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
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

    // ================= RESPONSE =================
    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return res.status(200).send(sitemap);
  } catch (error) {
    console.error("Sitemap error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to generate sitemap",
    });
  }
}
