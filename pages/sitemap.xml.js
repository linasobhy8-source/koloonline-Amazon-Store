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

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= SAFE DATE ================= */
function safeDate(date) {
  try {
    if (!date) return new Date().toISOString();
    if (typeof date === "number") return new Date(date).toISOString();
    if (date?.toDate) return date.toDate().toISOString();
    return new Date(date).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/* ================= SITEMAP ================= */
export async function getServerSideProps({ res }) {
  const baseUrl = "https://koloonline.online";

  /* ================= FETCH DATA ================= */
  const productSnap = await getDocs(collection(db, "products"));
  const blogSnap = await getDocs(collection(db, "blog"));

  const products = productSnap.docs.map((d) => d.id);

  const blogs = blogSnap.docs.map((d) => ({
    id: d.id,
    updatedAt: safeDate(
      d.data().updatedAt || d.data().createdAt
    ),
  }));

  /* ================= URL BUILDER ================= */
  let urls = "";

  /* ================= MAIN PAGES ================= */
  urls += `
<url>
  <loc>${baseUrl}/</loc>
  <priority>1.0</priority>
</url>

<url>
  <loc>${baseUrl}/blog</loc>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/products</loc>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/search</loc>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/amazon-haul</loc>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/categories</loc>
  <priority>0.8</priority>
</url>

<!-- ================= AFFILIATE PAGES ================= -->

<url>
  <loc>${baseUrl}/fiverr</loc>
  <priority>0.8</priority>
</url>

<url>
  <loc>${baseUrl}/aliexpress</loc>
  <priority>0.8</priority>
</url>

<!-- ================= BLOGGER ================= -->

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

<url>
  <loc>https://linasobhy.blogspot.com/feeds/posts/default</loc>
  <priority>0.6</priority>
</url>
`;

  /* ================= PRODUCTS ================= */
  products.forEach((id) => {
    urls += `
<url>
  <loc>${baseUrl}/product/${id}</loc>
  <priority>0.8</priority>
</url>
`;
  });

  /* ================= BLOG POSTS ================= */
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

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
}

/* ================= PAGE ================= */
export default function Sitemap() {
  return null;
      }
