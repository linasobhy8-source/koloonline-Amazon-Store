import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

function safeDate(value) {
  try {
    if (!value) return new Date().toISOString();
    if (typeof value?.toDate === "function") return value.toDate().toISOString();
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

async function getProductsUrls() {
  try {
    const snapshot = await getDocs(collection(db, "products"));

    const products = [];
    snapshot.forEach((doc) => {
      const data = doc.data();

      products.push({
        url: `${baseUrl}/product/${data.slug || doc.id}`,
        lastmod: safeDate(data.updatedAt),
        changefreq: "daily",
        priority: 0.9,
      });
    });

    return products;
  } catch (error) {
    console.error("Products sitemap error:", error);
    return [];
  }
}

export default async function handler(req, res) {
  try {
    const urls = await getProductsUrls();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `
  <url>
    <loc>${escapeXml(item.url)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>
`
  )
  .join("")}
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating products sitemap");
  }
}
