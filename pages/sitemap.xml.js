import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// ================= FIREBASE =================
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app =
  getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const db = getFirestore(app);

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

export async function getServerSideProps({ res }) {
  try {
    const now = new Date().toISOString();
    const urls = [];

    // ================= PRODUCTS =================
    const products = await getDocs(collection(db, "products"));

    products.forEach((doc) => {
      const data = doc.data();

      urls.push({
        loc: `${SITE_URL}/product/${data.slug || doc.id}`,
        lastmod: data.updatedAt
          ? new Date(data.updatedAt).toISOString()
          : now,
        changefreq: "daily",
        priority: "0.9",
      });
    });

    // ================= BLOG =================
    const blog = await getDocs(collection(db, "blog"));

    blog.forEach((doc) => {
      const data = doc.data();

      urls.push({
        loc: `${SITE_URL}/blog/${data.slug || doc.id}`,
        lastmod: data.updatedAt
          ? new Date(data.updatedAt).toISOString()
          : now,
        changefreq: "monthly",
        priority: "0.8",
      });
    });

    // ================= STATIC PAGES =================
    [
      "",
      "/about",
      "/products",
      "/categories",
      "/blog",
      "/amazon-haul",
      "/audible",
      "/aliexpress",
      "/fiverr",
      "/search",
      "/contact",
      "/privacy",
      "/terms",
      "/disclaimer",
      "/top/top-smart-watches",
      "/top/top-earbuds",
      "/top/top-smart-watches-under-100",
    ].forEach((page) => {
      urls.push({
        loc: `${SITE_URL}${page}`,
        lastmod: now,
        changefreq: "weekly",
        priority:
          page === ""
            ? "1.0"
            : page.startsWith("/top/")
            ? "0.9"
            : "0.8",
      });
    });

    const unique = [...new Map(urls.map((u) => [u.loc, u])).values()];

    unique.sort((a, b) => a.loc.localeCompare(b.loc));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (u) => `<url>
<loc>${u.loc}</loc>
<lastmod>${u.lastmod}</lastmod>
<changefreq>${u.changefreq}</changefreq>
<priority>${u.priority}</priority>
</url>`
  )
  .join("\n")}
</urlset>`;

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=UTF-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    res.write(xml);
    res.end();
  } catch (err) {
    console.error(err);

    res.statusCode = 500;
    res.end("Sitemap Error");
  }

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
