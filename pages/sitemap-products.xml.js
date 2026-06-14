import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const baseUrl = "https://koloonline.online";

/* ================= VIRAL SCORE ENGINE ================= */
function viralScore(data) {
  let score = 0;

  score += (data.views || 0) * 0.5;
  score += (data.clicks || 0) * 2;
  score += (data.addToCart || 0) * 5;
  score += (data.orders || 0) * 10;

  score += (data.rating || 0) * 20;

  if (data.shareCount > 10) score += 30;
  if (data.saveCount > 20) score += 20;

  if (data.trending) score += 50;
  if (data.viralBoost) score += 40;

  if (data.clicks < 5 && data.views > 100) score -= 20;

  return Math.max(0, Math.min(100, score));
}

/* ================= XML HELPERS ================= */
function url(loc, priority = 0.6, lastmod = null) {
  return `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const snap = await getDocs(collection(db, "products"));

  const urls = [];

  snap.forEach((doc) => {
    const data = doc.data();

    const score = viralScore(data);

    /* ❌ Remove dead products */
    if (score < 25) return;

    /* 🎯 Priority logic */
    let priority = 0.5;

    if (score > 80) priority = 1.0;       // 🔥 viral
    else if (score > 60) priority = 0.85; // trending
    else if (score > 40) priority = 0.7;  // good
    else priority = 0.6;

    urls.push(
      url(
        `${baseUrl}/product/${doc.id}`,
        priority,
        new Date().toISOString()
      )
    );
  });

  /* 🔥 Sort by priority impact (optional boost ordering) */
  urls.sort((a, b) => b.includes("1.0") - a.includes("1.0"));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml);
    }
