import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";

// ================= FIREBASE INIT =================
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

// ================= SITE URL =================
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://koloonline.online";

// ================= HANDLER =================
export default async function handler(req, res) {
  try {
    const now = new Date().toISOString();

    const urls = [];

    // ================= PRODUCTS =================
    const productsSnap = await getDocs(collection(db, "products"));

    productsSnap.forEach((doc) => {
      const p = doc.data();

      if (!p?.slug) return;

      urls.push({
        loc: `${SITE_URL}/product/${p.slug}`,
        lastmod: p.updatedAt
          ? new Date(p.updatedAt).toISOString()
          : now,
        changefreq: "daily",
        priority: 0.9,
      });
    });

    // ================= BLOG POSTS =================
    const blogSnap = await getDocs(collection(db, "blog"));

    blogSnap.forEach((doc) => {
      const post = doc.data();

      if (!post?.slug) return;

      urls.push({
        loc: `${SITE_URL}/blog/${post.slug}`,
        lastmod: post.updatedAt
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

    // ================= SORT =================
    uniqueUrls.sort((a, b) => a.loc.localeCompare(b.loc));

    // ================= XML BUILD =================
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
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Sitemap error:", error);
    res.status(500).json({ error: "Failed to generate sitemap" });
  }
      }
