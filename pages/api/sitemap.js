import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";
    const now = new Date().toISOString();

    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    /* ================= CATEGORY SET ================= */
    const categorySet = new Set();

    products.forEach((p) => {
      if (p?.category) {
        categorySet.add(
          p.category
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
        );
      }
    });

    const categories = Array.from(categorySet);

    /* ================= STATIC URLS ================= */
    let urls = `
<url>
  <loc>${baseUrl}</loc>
  <lastmod>${now}</lastmod>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>

<url>
  <loc>${baseUrl}/categories</loc>
  <lastmod>${now}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
`;

    /* ================= CATEGORY PAGES ================= */
    categories.forEach((cat) => {
      urls += `
<url>
  <loc>${baseUrl}/category/${cat}</loc>
  <lastmod>${now}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.85</priority>
</url>
`;
    });

    /* ================= PRODUCT PAGES ================= */
    products.forEach((p) => {
      if (!p?.id) return;

      urls += `
<url>
  <loc>${baseUrl}/product/${p.id}</loc>
  <lastmod>${now}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
`;
    });

    /* ================= FINAL XML ================= */
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");

    // 🔥 SEO BOOST: caching for speed
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return res.status(200).send(sitemap);

  } catch (error) {
    console.error("SITEMAP ERROR:", error);
    return res.status(500).send("Error generating sitemap");
  }
}
