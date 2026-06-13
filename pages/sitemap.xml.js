import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app =
  !getApps().length
    ? initializeApp(firebaseConfig)
    : getApps()[0];

const db = getFirestore(app);

/* ================= SAFE DATE ================= */
function safeDate(date) {
  try {
    if (!date) return new Date().toISOString();

    if (typeof date === "number") {
      return new Date(date).toISOString();
    }

    if (date?.toDate) {
      return date.toDate().toISOString();
    }

    return new Date(date).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/* ================= SITEMAP ================= */
export async function getServerSideProps({ res }) {
  const baseUrl = "https://koloonline.online";
  const today = new Date().toISOString();

  let products = [];
  let blogs = [];

  try {
    const [productSnap, blogSnap] = await Promise.all([
      getDocs(collection(db, "products")),
      getDocs(collection(db, "blog")),
    ]);

    products = productSnap.docs.map((d) => d.id);

    blogs = blogSnap.docs.map((d) => ({
      id: d.id,
      updatedAt: safeDate(
        d.data().updatedAt || d.data().createdAt
      ),
    }));
  } catch (error) {
    console.error("Sitemap Error:", error);
  }

  /* ================= URL BUILDER ================= */
  let urls = "";

  /* ================= STATIC PAGES ================= */
  urls += `
<url>
  <loc>${baseUrl}/</loc>
  <lastmod>${today}</lastmod>
  <priority>1.0</priority>
</url>

<url>
  <loc>${baseUrl}/blog</loc>
  <lastmod>${today}</lastmod>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/products</loc>
  <lastmod>${today}</lastmod>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/search</loc>
  <lastmod>${today}</lastmod>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/amazon-haul</loc>
  <lastmod>${today}</lastmod>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/categories</loc>
  <lastmod>${today}</lastmod>
  <priority>0.8</priority>
</url>

<url>
  <loc>${baseUrl}/fiverr</loc>
  <lastmod>${today}</lastmod>
  <priority>0.8</priority>
</url>

<url>
  <loc>${baseUrl}/aliexpress</loc>
  <lastmod>${today}</lastmod>
  <priority>0.8</priority>
</url>

<url>
  <loc>https://linasobhy.blogspot.com/</loc>
  <priority>0.7</priority>
</url>

<url>
  <loc>https://linasobhy.blogspot.com/p/about.html</loc>
  <priority>0.6</priority>
</url>

<url>
  <loc>https://linasobhy.blogspot.com/p/contact.html</loc>
  <priority>0.6</priority>
</url>
`;

  /* ================= DYNAMIC PRODUCTS ================= */
  products.forEach((id) => {
    urls += `
<url>
  <loc>${baseUrl}/product/${id}</loc>
  <priority>0.8</priority>
</url>
`;
  });

  /* ================= DYNAMIC BLOGS ================= */
  blogs.forEach((b) => {
    urls += `
<url>
  <loc>${baseUrl}/blog/${b.id}</loc>
  <lastmod>${b.updatedAt}</lastmod>
  <priority>0.8</priority>
</url>
`;
  });

  /* ================= FINAL XML ================= */
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls}

</urlset>`;

  /* ================= RESPONSE HEADERS ================= */
  res.setHeader("Content-Type", "text/xml");

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );

  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

/* ================= PAGE ================= */
export default function Sitemap() {
  return null;
             }
