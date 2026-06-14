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

function url(loc, priority = 0.6) {
  return `
  <url>
    <loc>${loc}</loc>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export default async function handler(req, res) {
  const snap = await getDocs(collection(db, "products"));

  const urls = [];

  snap.forEach((doc) => {
    const data = doc.data();

    const score =
      (data.views || 0) +
      (data.clicks || 0) * 2 +
      (data.rating || 0) * 10;

    if (score < 10) return;

    urls.push(url(`${baseUrl}/product/${doc.id}`, 0.7));
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml);
}
