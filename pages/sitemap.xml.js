import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

import { topPages } from "../data/topPages";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const baseUrl = "https://koloonline.online";

/* ================= HELPERS ================= */
function safeDate(date) {
  try {
    if (!date) return new Date().toISOString();
    if (typeof date.toDate === "function") return date.toDate().toISOString();
    return new Date(date).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function escapeXml(url) {
  return url
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function url(loc, lastmod, priority = 0.7) {
  return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <priority>${priority}</priority>
  </url>`;
}

/* ================= SITEMAP PAGE ================= */
export default function SitemapXML() {
  return null;
}

/* ================= SERVER SIDE RENDER ================= */
export async function getServerSideProps({ res }) {
  try {
    const urls = new Set();

    /* ===== CORE PAGES ===== */
    urls.add(url(`${baseUrl}/`, new Date().toISOString(), 1.0));
    urls.add(url(`${baseUrl}/products`, new Date().toISOString(), 0.9));
    urls.add(url(`${baseUrl}/blog`, new Date().toISOString(), 0.9));
    urls.add(url(`${baseUrl}/categories`, new Date().toISOString(), 0.8));
    urls.add(url(`${baseUrl}/amazon-haul`, new Date().toISOString(), 0.8));

    /* ===== TOP PAGES ===== */
    if (Array.isArray(topPages)) {
      topPages.forEach((p) => {
        if (p?.slug) {
          urls.add(
            url(`${baseUrl}/top/${p.slug}`, new Date().toISOString(), 0.8)
          );
        }
      });
    }

    /* ===== PRODUCTS ===== */
    const productsSnap = await getDocs(collection(db, "products"));

    productsSnap.forEach((doc) => {
      const data = doc.data();

      urls.add(
        url(
          `${baseUrl}/product/${doc.id}`,
          safeDate(data?.updatedAt),
          0.85
        )
      );
    });

    /* ===== BLOG ===== */
    const blogSnap = await getDocs(collection(db, "blog"));

    blogSnap.forEach((doc) => {
      const data = doc.data();

      const slug = data?.slug || doc.id;

      urls.add(
        url(
          `${baseUrl}/blog/${slug}`,
          safeDate(data?.createdAt),
          0.9
        )
      );
    });

    /* ================= XML OUTPUT ================= */
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urls).join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

    res.write(xml);
    res.end();

    return {
      props: {},
    };
  } catch (e) {
    res.statusCode = 500;
    res.end("Sitemap Error");

    return {
      props: {},
    };
  }
          }
