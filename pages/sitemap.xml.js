import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= SITEMAP ================= */
export default function Sitemap() {}

export async function getServerSideProps({ res }) {

  const baseUrl = "https://koloonline.online";

  /* ================= STATIC ================= */
  const staticPages = [
    "",
    "/categories",
    "/search",
  ];

  const staticUrls = staticPages.map((page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
  `);

  /* ================= PRODUCTS ================= */
  let productUrls = [];

  try {
    const snap = await getDocs(collection(db, "products"));

    productUrls = snap.docs.map((doc) => {
      const data = doc.data();

      return `
        <url>
          <loc>${baseUrl}/product/${doc.id}</loc>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `;
    });

  } catch (err) {
    console.error("Sitemap Products Error:", err);
  }

  /* ================= CATEGORIES ================= */
  let categories = new Set();

  try {
    const snap = await getDocs(collection(db, "products"));

    snap.forEach((doc) => {
      const data = doc.data();
      if (data.category) {
        categories.add(data.category.toLowerCase());
      }
    });

  } catch (err) {
    console.error("Category Error:", err);
  }

  const categoryUrls = [...categories].map((cat) => `
    <url>
      <loc>${baseUrl}/category/${cat}</loc>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>
  `);

  /* ================= FINAL XML ================= */
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls.join("")}
    ${productUrls.join("")}
    ${categoryUrls.join("")}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}
