import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { topPages } from "../../data/topPages";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const db = getFirestore(app);

const baseUrl = "https://koloonline.online";

/* ================= HELPERS ================= */
function safeDate(value) {
  try {
    if (!value) return new Date().toISOString();

    if (typeof value?.toDate === "function") {
      return value.toDate().toISOString();
    }

    return new Date(value).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrl(loc, lastmod, priority = 0.7) {
  return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/* ================= VIRAL SCORE ================= */
function viralScore(item = {}) {
  let score = 0;

  score += Number(item.views || 0) * 1;
  score += Number(item.clicks || 0) * 2;
  score += Number(item.orders || 0) * 5;
  score += Number(item.rating || 0) * 20;
  score += Number(item.likes || 0) * 3;

  if (item.viralBoost) score += 100;
  if (item.trending) score += 50;

  return score;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const urls = [];

    const now = new Date().toISOString();

    /* ===== CORE PAGES ===== */
    urls.push(buildUrl(`${baseUrl}/`, now, 1.0));
    urls.push(buildUrl(`${baseUrl}/products`, now, 0.95));
    urls.push(buildUrl(`${baseUrl}/blog`, now, 0.90));
    urls.push(buildUrl(`${baseUrl}/categories`, now, 0.85));
    urls.push(buildUrl(`${baseUrl}/amazon-haul`, now, 0.85));

    /* ===== TOP PAGES ===== */
    if (Array.isArray(topPages)) {
      topPages.forEach((page) => {
        if (!page?.slug) return;

        urls.push(
          buildUrl(
            `${baseUrl}/top/${page.slug}`,
            now,
            0.80
          )
        );
      });
    }

    /* ===== PRODUCTS ===== */
    try {
      const productsSnap = await getDocs(
        collection(db, "products")
      );

      const productUrls = [];

      productsSnap.forEach((doc) => {
        const data = doc.data();

        const score = viralScore(data);

        // حذف المنتجات الضعيفة
        if (score < 25) return;

        let priority = 0.6;

        if (score >= 300) priority = 1.0;
        else if (score >= 150) priority = 0.9;
        else if (score >= 75) priority = 0.8;
        else priority = 0.7;

        productUrls.push({
          priority,
          xml: buildUrl(
            `${baseUrl}/product/${doc.id}`,
            safeDate(data.updatedAt),
            priority
          ),
        });

        // category pages
        if (data?.category) {
          productUrls.push({
            priority: 0.75,
            xml: buildUrl(
              `${baseUrl}/category/${encodeURIComponent(
                String(data.category).toLowerCase()
              )}`,
              now,
              0.75
            ),
          });
        }
      });

      productUrls
        .sort((a, b) => b.priority - a.priority)
        .forEach((item) => urls.push(item.xml));
    } catch (err) {
      console.error("Products sitemap error:", err);
    }

    /* ===== BLOG ===== */
    try {
      const blogSnap = await getDocs(
        collection(db, "blog")
      );

      blogSnap.forEach((doc) => {
        const data = doc.data();

        const slug = data?.slug || doc.id;

        urls.push(
          buildUrl(
            `${baseUrl}/blog/${slug}`,
            safeDate(data.createdAt),
            0.85
          )
        );
      });
    } catch (err) {
      console.error("Blog sitemap error:", err);
    }

    /* ================= XML ================= */
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return res.status(200).send(xml);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
