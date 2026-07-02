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
  console.log("========== SITEMAP REQUEST ==========");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("=====================================");

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: "Method Not Allowed" });
  }

  try {
    const now = new Date().toISOString();

    const urls = [];

    // ================= PRODUCTS =================
    const productsSnap = await getDocs(collection(db, "products"));

    console.log("Products:", productsSnap.size);

    productsSnap.forEach((doc) => {
      const p = doc.data();

      const productId = p.slug || doc.id;

      urls.push({
        loc: `${SITE_URL}/product/${productId}`,
        lastmod: p.updatedAt
          ? new Date(p.updatedAt).toISOString()
          : now,
        changefreq: "daily",
        priority: 0.9,
      });
    });

    // ================= BLOG =================
    const blogSnap = await getDocs(collection(db, "blog"));

    console.log("Blog:", blogSnap.size);

    blogSnap.forEach((doc) => {
      const post = doc.data();

      const slug = post.slug || doc.id;

      urls.push({
        loc: `${SITE_URL}/blog/${slug}`,
        lastmod: post.updatedAt
          ? new Date(post.updatedAt).toISOString()
          : now,
        changefreq: "monthly",
        priority: 0.85,
      });
    });

    // ================= STATIC =================
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
      new Map(urls.map((u) => [u.loc, u])).values()
    );

    uniqueUrls.sort((a, b) =>
      a.loc.localeCompare(b.loc)
    );

    console.log("Total URLs:", uniqueUrls.length);

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

    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate"
    );

    return res.status(200).send(sitemap);
  } catch (error) {
    console.error("SITEMAP ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
