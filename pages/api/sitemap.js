import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= PING SEARCH ENGINES ================= */
async function pingSearchEngines() {
  const sitemapUrl = "https://koloonline.online/sitemap.xml";

  try {
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);

    console.log("🚀 Sitemap pinged successfully");
  } catch (e) {
    console.log("Ping error:", e.message);
  }
}

/* ================= SAFE DATE ================= */
function safeDate(date) {
  try {
    if (!date) return new Date().toISOString();
    if (typeof date === "number") return new Date(date).toISOString();
    if (date.toDate) return date.toDate().toISOString();
    return new Date(date).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";

    /* ================= PRODUCTS ================= */
    const productSnap = await getDocs(collection(db, "products"));

    const products = productSnap.docs.map((doc) => {
      const d = doc.data();

      return {
        id: doc.id,
        category: (d.category || "general").toLowerCase(),
        updatedAt: safeDate(d.updatedAt || d.createdAt),
      };
    });

    /* ================= BLOGS ================= */
    const blogSnap = await getDocs(collection(db, "blog"));

    const blogs = blogSnap.docs.map((doc) => {
      const d = doc.data();

      return {
        id: doc.id,
        updatedAt: safeDate(d.updatedAt || d.createdAt),
        isTop: d.isTop || false,
      };
    });

    /* ================= CATEGORIES ================= */
    const categories = [...new Set(products.map((p) => p.category))];

    /* ================= STATIC URLS ================= */
    let urls = `
<url>
  <loc>${baseUrl}/</loc>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>

<url>
  <loc>${baseUrl}/blog</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/products</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/search</loc>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>
`;

    /* ================= CATEGORIES ================= */
    categories.forEach((cat) => {
      if (!cat) return;

      urls += `
<url>
  <loc>${baseUrl}/category/${cat}</loc>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>`;
    });

    /* ================= PRODUCTS ================= */
    products.forEach((p) => {
      urls += `
<url>
  <loc>${baseUrl}/product/${p.id}</loc>
  <lastmod>${p.updatedAt}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>`;
    });

    /* ================= BLOGS (FINAL FIXED PRIORITY) ================= */
    blogs.forEach((b) => {
      const priority = b.isTop ? 1.0 : 0.8;

      urls += `
<url>
  <loc>${baseUrl}/blog/${b.id}</loc>
  <lastmod>${b.updatedAt}</lastmod>
  <changefreq>daily</changefreq>
  <priority>${priority}</priority>
</url>`;
    });

    /* ================= FINAL XML ================= */
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, s-maxage=3600");

    /* ================= PING ================= */
    setTimeout(() => {
      pingSearchEngines();
    }, 5000);

    return res.status(200).send(sitemap);

  } catch (e) {
    console.error("Sitemap error:", e);
    return res.status(500).send("Sitemap error");
  }
        }
