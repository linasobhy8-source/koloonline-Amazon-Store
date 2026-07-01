import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const db = getFirestore(app);

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.koloonline.online";

export default async function handler(req, res) {
  try {
    const now = new Date().toISOString();

    const productsSnap = await getDocs(collection(db, "products"));

    const urls = [];

    // ================= PRODUCTS =================
    productsSnap.forEach((doc) => {
      const p = doc.data();

      if (!p.slug) return;

      urls.push({
        loc: `${SITE_URL}/product/${p.slug}`,
        lastmod: p.updatedAt
          ? new Date(p.updatedAt).toISOString()
          : now,
        changefreq: "daily",
        priority: 0.9,
      });
    });

    // ================= STATIC PAGES =================
    const staticPages = [
      "",

      // Main Pages
      "/products",
      "/categories",
      "/blog",

      // Blog Pages
      "/blog/amazon-finds-under-25",
      "/blog/best-gaming-accessories",
      "/blog/best-headphones-2026",
      "/blog/best-power-banks-2026",
      "/blog/best-smart-watches",
      "/blog/budget-tech-products",
      "/blog/smart-home-devices-2026",
      "/blog/tiktok-amazon-gadgets",
      "/blog/usb-c-accessories",
      "/blog/viral-products-amazon",

      // Company Pages
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
        changefreq: page.startsWith("/blog/") ? "monthly" : "weekly",
        priority:
          page === ""
            ? 1.0
            : page.startsWith("/blog/")
            ? 0.85
            : 0.8,
      });
    });

    // إزالة أي روابط مكررة
    const uniqueUrls = Array.from(
      new Map(urls.map((u) => [u.loc, u])).values()
    );

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

    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return res.status(200).send(sitemap);
  } catch (error) {
    console.error("Sitemap Error:", error);

    return res.status(500).json({
      success: false,
      error: "Sitemap generation failed",
    });
  }
}
