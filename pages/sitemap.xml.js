import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

import { topPages } from "../data/topPages";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const baseUrl = "https://koloonline.online";

/* ================= AI SEO SCORE ================= */
function aiScore(item) {
  let score = 50;

  if (item?.views > 1000) score += 20;
  if (item?.clicks > 200) score += 15;
  if (item?.likes > 50) score += 10;
  if (item?.title?.length > 20) score += 5;
  if (item?.auto) score -= 10; // low quality penalty

  return Math.min(100, Math.max(0, score));
}

/* ================= XML HELPER ================= */
function url(loc, lastmod, priority) {
  return `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <priority>${priority}</priority>
  </url>`;
}

function xmlWrap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const urls = [];

  /* ===== CORE ===== */
  urls.push(url(`${baseUrl}/`, new Date().toISOString(), 1.0));
  urls.push(url(`${baseUrl}/products`, new Date().toISOString(), 0.9));
  urls.push(url(`${baseUrl}/blog`, new Date().toISOString(), 0.9));

  /* ===== TOP PAGES ===== */
  topPages.forEach((p) => {
    urls.push(url(`${baseUrl}/top/${p.slug}`, new Date().toISOString(), 0.8));
  });

  /* ===== PRODUCTS (AI FILTER + RANKING) ===== */
  const productsSnap = await getDocs(collection(db, "products"));

  const products = [];

  productsSnap.forEach((doc) => {
    const data = doc.data();

    const score = aiScore(data);

    // ❌ remove low quality pages
    if (score < 30) return;

    products.push({
      url: `${baseUrl}/product/${doc.id}`,
      score,
      updated: data?.updatedAt,
    });
  });

  // 🔥 ranking
  products
    .sort((a, b) => b.score - a.score)
    .forEach((p) => {
      urls.push(
        url(
          p.url,
          new Date().toISOString(),
          Math.min(1, p.score / 100)
        )
      );
    });

  /* ===== BLOG (AI FILTER + RANKING) ===== */
  const blogSnap = await getDocs(collection(db, "blog"));

  const blogs = [];

  blogSnap.forEach((doc) => {
    const data = doc.data();

    const score = aiScore(data);

    if (score < 25) return;

    blogs.push({
      url: `${baseUrl}/blog/${data.slug || doc.id}`,
      score,
    });
  });

  blogs
    .sort((a, b) => b.score - a.score)
    .forEach((b) => {
      urls.push(
        url(b.url, new Date().toISOString(), Math.min(1, b.score / 100))
      );
    });

  /* ===== OUTPUT ===== */
  const xml = xmlWrap(urls);

  res.setHeader("Content-Type", "application/xml");
  return res.status(200).send(xml);
      }
