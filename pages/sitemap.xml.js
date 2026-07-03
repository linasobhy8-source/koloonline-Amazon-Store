import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app =
  getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const db = getFirestore(app);

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://koloonline.online";

export async function getServerSideProps({ res }) {
  const now = new Date().toISOString();

  const urls = [];

  const staticPages = [
    "",
    "/about",
    "/aliexpress",
    "/amazon-haul",
    "/audible",
    "/blog",
    "/categories",
    "/contact",
    "/disclaimer",
    "/fiverr",
    "/privacy",
    "/products",
    "/search",
    "/terms",
    "/top/top-earbuds",
    "/top/top-smart-watches",
    "/top/top-smart-watches-under-100",
  ];

  staticPages.forEach((page) => {
    urls.push({
      loc: `${SITE_URL}${page}`,
      lastmod: now,
      changefreq: "weekly",
      priority: page === "" ? 1 : page.startsWith("/top/") ? 0.9 : 0.8,
    });
  });

  try {
    const products = await getDocs(collection(db, "products"));

    products.forEach((doc) => {
      const p = doc.data();

      urls.push({
        loc: `${SITE_URL}/product/${p.slug || doc.id}`,
        lastmod: now,
        changefreq: "daily",
        priority: 0.9,
      });
    });
  } catch (e) {
    console.log(e);
  }

  try {
    const posts = await getDocs(collection(db, "blog"));

    posts.forEach((doc) => {
      const p = doc.data();

      urls.push({
        loc: `${SITE_URL}/blog/${p.slug || doc.id}`,
        lastmod: now,
        changefreq: "weekly",
        priority: 0.8,
      });
    });
  } catch (e) {
    console.log(e);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls
  .map(
    (u) => `
<url>
<loc>${u.loc}</loc>
<lastmod>${u.lastmod}</lastmod>
<changefreq>${u.changefreq}</changefreq>
<priority>${u.priority}</priority>
</url>`
  )
  .join("")}

</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );

  res.write(xml);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
