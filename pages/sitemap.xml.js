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

function url(loc, lastmod, priority) {
  return `
<url>
  <loc>${loc}</loc>
  ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  <priority>${priority}</priority>
</url>`;
}

/* ================= SITEMAP ================= */
export default async function Sitemap() {
  const urls = [];

  /* ===== CORE PAGES ===== */
  urls.push(url(`${baseUrl}/`, new Date().toISOString(), 1.0));
  urls.push(url(`${baseUrl}/products`, new Date().toISOString(), 0.9));
  urls.push(url(`${baseUrl}/blog`, new Date().toISOString(), 0.9));
  urls.push(url(`${baseUrl}/categories`, new Date().toISOString(), 0.8));
  urls.push(url(`${baseUrl}/amazon-haul`, new Date().toISOString(), 0.8));

  /* ===== TOP PAGES ===== */
  topPages.forEach((p) => {
    urls.push(
      url(`${baseUrl}/top/${p.slug}`, new Date().toISOString(), 0.8)
    );
  });

  /* ===== PRODUCTS ===== */
  const productsSnap = await getDocs(collection(db, "products"));

  productsSnap.forEach((doc) => {
    const data = doc.data();

    urls.push(
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

    urls.push(
      url(
        `${baseUrl}/blog/${data.slug || doc.id}`,
        safeDate(data?.createdAt),
        0.9
      )
    );
  });

  /* ================= FINAL XML ================= */
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
