import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= HELPERS ================= */
function cleanUrl(url) {
  return url?.replace(/\/+$/, "")?.trim();
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const key = process.env.INDEXNOW_KEY;
    const baseUrl = "https://koloonline.online";

    /* ================= CORE SEO PAGES ================= */
    let urls = [
      `${baseUrl}`,
      `${baseUrl}/blog`,
      `${baseUrl}/products`,
      `${baseUrl}/categories`,
      `${baseUrl}/search`,
      `${baseUrl}/amazon-haul`,
      `${baseUrl}/fiverr`,
      `${baseUrl}/aliexpress`,
    ];

    /* ================= PRODUCTS ================= */
    const productsSnap = await getDocs(collection(db, "products"));

    const productUrls = productsSnap.docs
      .slice(0, 200)
      .map((doc) => `${baseUrl}/product/${doc.id}`);

    /* ================= BLOGS ================= */
    const blogSnap = await getDocs(collection(db, "blog"));

    const blogUrls = blogSnap.docs
      .slice(0, 100)
      .map((doc) => {
        const d = doc.data();
        const slug = d.slug || doc.id;
        return `${baseUrl}/blog/${slug}`;
      });

    /* ================= CATEGORIES ================= */
    const categoriesSnap = await getDocs(collection(db, "products"));

    const categoryUrls = [
      ...new Set(
        categoriesSnap.docs.map((doc) => {
          const d = doc.data();
          return d.category
            ? `${baseUrl}/category/${d.category.toLowerCase()}`
            : null;
        })
      ),
    ].filter(Boolean);

    /* ================= MERGE URLS ================= */
    urls = [
      ...new Set([
        ...urls,
        ...productUrls,
        ...blogUrls,
        ...categoryUrls,
      ]),
    ].map(cleanUrl);

    /* ================= HIGH PRIORITY ================= */
    const highPriorityUrls = urls.filter(
      (u) =>
        u.includes("/product/") ||
        u.includes("/blog/") ||
        u === baseUrl ||
        u.includes("/fiverr") ||
        u.includes("/aliexpress")
    );

    /* ================= CHUNKING ================= */
    const chunks = [];
    const chunkSize = 50;

    for (let i = 0; i < highPriorityUrls.length; i += chunkSize) {
      chunks.push(highPriorityUrls.slice(i, i + chunkSize));
    }

    /* ================= INDEXNOW PUSH ================= */
    const results = [];

    for (const chunk of chunks) {
      try {
        const response = await fetch(
          "https://api.indexnow.org/indexnow",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              host: "koloonline.online",
              key,
              urlList: chunk,
            }),
          }
        );

        results.push({
          count: chunk.length,
          status: response.status,
          result: await response.text(),
        });
      } catch (err) {
        results.push({
          error: err.message,
        });
      }
    }

    /* ================= GOOGLE PING ================= */
    try {
      await fetch(
        `https://www.google.com/ping?sitemap=https://koloonline.online/sitemap.xml`
      );
    } catch {}

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      totalUrls: urls.length,
      indexedUrls: highPriorityUrls.length,
      chunks: chunks.length,
      results,
    });

  } catch (e) {
    console.error("IndexNow Error:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
