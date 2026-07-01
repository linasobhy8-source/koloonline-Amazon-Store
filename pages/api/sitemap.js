import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const SITE_URL = "https://www.koloonline.online";

export default async function handler(req, res) {
  try {
    const productsSnap = await getDocs(collection(db, "products"));

    const urls = [];

    productsSnap.forEach((doc) => {
      const p = doc.data();

      if (!p.slug) return;

      urls.push({
        loc: `${SITE_URL}/product/${p.slug}`,
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
        changefreq: "daily",
        priority: 0.9,
      });
    });

    const staticPages = [
      "",
      "/about",
      "/contact",
      "/blog",
    ];

    staticPages.forEach((page) => {
      urls.push({
        loc: `${SITE_URL}${page}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 1.0,
      });
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
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

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sitemap generation failed" });
  }
}
