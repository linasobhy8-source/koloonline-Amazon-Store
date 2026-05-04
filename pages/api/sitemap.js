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

    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`);

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
    const snap = await getDocs(collection(db, "products"));

    console.log("📦 Products:", snap.docs.length);

    /* ================= PRODUCTS ================= */
    let products = snap.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        category: data.category || "general",
        score: data.score || 0,
        updatedAt: data.updatedAt || 0,
      };
    });

    /* ================= AI SORT ================= */
    products.sort((a, b) => {
      const scoreA = (a.score || 0);
      const scoreB = (b.score || 0);
      return scoreB - scoreA;
    });

    /* ================= CATEGORIES ================= */
    const categories = [...new Set(products.map(p => p.category.toLowerCase()))];

    console.log("📂 Categories:", categories);

    /* ================= STATIC ================= */
    let urls = `
<url>
  <loc>${baseUrl}</loc>
  <changefreq>hourly</changefreq>
  <priority>1.0</priority>
</url>

<url>
  <loc>${baseUrl}/categories</loc>
  <changefreq>hourly</changefreq>
  <priority>0.9</priority>
</url>
`;

    /* ================= CATEGORY URLs ================= */
    categories.forEach((cat) => {
      urls += `
<url>
  <loc>${baseUrl}/category/${cat}</loc>
  <changefreq>hourly</changefreq>
  <priority>0.8</priority>
</url>
`;
    });

    /* ================= PRODUCT URLs (AI PRIORITY) ================= */
    products.forEach((p, index) => {
      const priority = Math.max(0.5, 1 - index * 0.01);

      urls += `
<url>
  <loc>${baseUrl}/product/${p.id}</loc>
  <changefreq>hourly</changefreq>
  <priority>${priority.toFixed(2)}</priority>
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

    /* ================= AUTO INDEXING ================= */
    pingGoogle();

    return res.status(200).send(sitemap);

  } catch (error) {
    console.error("❌ Sitemap Error:", error);
    return res.status(500).send("Sitemap error");
  }
}
