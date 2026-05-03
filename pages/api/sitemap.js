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

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const baseUrl = "https://koloonline.online";

  const snap = await getDocs(collection(db, "products"));

  const products = snap.docs.map((doc) => doc.id);

  const categories = new Set();

  snap.forEach((doc) => {
    const data = doc.data();
    if (data.category) {
      categories.add(data.category.toLowerCase());
    }
  });

  let urls = `
<url>
  <loc>${baseUrl}</loc>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>

<url>
  <loc>${baseUrl}/categories</loc>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>
`;

  /* PRODUCTS */
  products.forEach((id) => {
    urls += `
<url>
  <loc>${baseUrl}/product/${id}</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
`;
  });

  /* CATEGORIES */
  [...categories].forEach((cat) => {
    urls += `
<url>
  <loc>${baseUrl}/category/${cat}</loc>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>
`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );

  return res.status(200).send(sitemap);
}
