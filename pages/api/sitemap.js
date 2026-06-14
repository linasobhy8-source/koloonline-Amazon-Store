import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";

import { topPages } from "../../data/topPages";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const baseUrl = "https://koloonline.online";

/* ================= SAFE DATE ================= */
function safeDate(date) {
  try {
    if (!date) return new Date().toISOString();
    if (typeof date.toDate === "function") {
      return date.toDate().toISOString();
    }
    return new Date(date).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/* ================= XML BUILDER ================= */
function generateSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

/* ================= URL BUILDER ================= */
function urlNode(loc, lastmod = null, priority = 0.7) {
  return `
<url>
  <loc>${loc}</loc>
  ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  <priority>${priority}</priority>
</url>`;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  /* =====================================================
     GET = SITEMAP
  ===================================================== */
  if (req.method === "GET") {
    try {
      const urls = [];

      /* ================= CORE PAGES ================= */
      urls.push(urlNode(`${baseUrl}/`, new Date().toISOString(), 1.0));
      urls.push(urlNode(`${baseUrl}/blog`, new Date().toISOString(), 0.9));
      urls.push(urlNode(`${baseUrl}/products`, new Date().toISOString(), 0.9));
      urls.push(urlNode(`${baseUrl}/categories`, new Date().toISOString(), 0.8));
      urls.push(urlNode(`${baseUrl}/amazon-haul`, new Date().toISOString(), 0.8));

      /* ================= TOP PAGES ================= */
      topPages.forEach((page) => {
        urls.push(
          urlNode(
            `${baseUrl}/top/${page.slug}`,
            new Date().toISOString(),
            0.8
          )
        );
      });

      /* ================= PRODUCTS ================= */
      const productsSnap = await getDocs(collection(db, "products"));

      productsSnap.forEach((doc) => {
        const data = doc.data();

        urls.push(
          urlNode(
            `${baseUrl}/product/${doc.id}`,
            safeDate(data?.updatedAt),
            0.85
          )
        );
      });

      /* ================= BLOG ================= */
      const blogSnap = await getDocs(collection(db, "blog"));

      blogSnap.forEach((doc) => {
        const data = doc.data();

        urls.push(
          urlNode(
            `${baseUrl}/blog/${data.slug || doc.id}`,
            safeDate(data?.createdAt),
            0.9
          )
        );
      });

      /* ================= FINAL ================= */
      const sitemap = generateSitemap(urls);

      res.setHeader("Content-Type", "application/xml");
      return res.status(200).send(sitemap);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /* =====================================================
     POST = STATS (IndexNow / SEO Engine)
  ===================================================== */
  if (req.method === "POST") {
    try {
      const [productsCount, blogsCount] = await Promise.all([
        getCountFromServer(collection(db, "products")),
        getCountFromServer(collection(db, "blog")),
      ]);

      return res.status(200).json({
        success: true,
        stats: {
          productsCount: productsCount.data().count || 0,
          blogsCount: blogsCount.data().count || 0,
          totalContent:
            (productsCount.data().count || 0) +
            (blogsCount.data().count || 0),
        },
        sitemap: `${baseUrl}/sitemap.xml`,
        timestamp: Date.now(),
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: e.message,
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: "Method not allowed",
  });
}
