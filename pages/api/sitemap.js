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

/* ================= GOOGLE PING ================= */
async function pingGoogle() {
  try {
    const url = "https://koloonline.online/api/sitemap";

    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`
    );

    console.log("🚀 Google Ping Sent");
  } catch (e) {
    console.log("Ping error:", e.message);
  }
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    console.log("🔥 Sitemap Generator Started");

    const baseUrl = "https://koloonline.online";

    /* ================= PRODUCTS ================= */
    const productSnap = await getDocs(collection(db, "products"));

    let products = productSnap.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        category: data.category || "general",
        score: data.score || 0,
        updatedAt: data.updatedAt || Date.now(),
      };
    });

    /* ================= BLOG POSTS ================= */
    const blogSnap = await getDocs(collection(db, "blog"));

    let blogs = blogSnap.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        updatedAt: data.createdAt || Date.now(),
      };
    });

    /* ================= SORT PRODUCTS ================= */
    products.sort((a, b) => b.score - a.score);

    /* ================= CATEGORIES ================= */
    const categories = [...new Set(products.map(p => p.category.toLowerCase()))];

    /* ================= XML START ================= */
    let urls = `
<url>
  <loc>${baseUrl}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>hourly</changefreq>
  <priority>1.0</priority>
</url>

<url>
  <loc>${baseUrl}/blog</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
`;

    /* ================= CATEGORIES ================= */
    categories.forEach((cat) => {
      urls += `
<url>
  <loc>${baseUrl}/category/${cat}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>hourly</changefreq>
  <priority>0.8</priority>
</url>
`;
    });

    /* ================= PRODUCTS ================= */
    products.forEach((p, index) => {
      const priority = Math.max(0.5, 1 - index * 0.01);

      urls += `
<url>
  <loc>${baseUrl}/product/${p.id}</loc>
  <lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>
  <changefreq>hourly</changefreq>
  <priority>${priority.toFixed(2)}</priority>
</url>
`;
    });

    /* ================= BLOG POSTS ================= */
    blogs.forEach((b) => {
      urls += `
<url>
  <loc>${baseUrl}/blog/${b.id}</loc>
  <lastmod>${new Date(b.updatedAt).toISOString()}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.7</priority>
</url>
`;
    });

    /* ================= FINAL XML ================= */
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    /* ================= HEADERS ================= */
    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=3600"
    );

    /* ================= GOOGLE INDEXING ================= */
    setTimeout(() => {
      pingGoogle();
    }, 3000);

    return res.status(200).send(sitemap);

  } catch (error) {
    console.error("❌ Sitemap Error:", error);
    return res.status(500).send("Sitemap error");
  }
}
