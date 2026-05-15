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
  return url
    ?.replace(/\/+$/, "")
    ?.trim();
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const key = process.env.INDEXNOW_KEY;
    const baseUrl = "https://koloonline.online";

    /* ================= CORE PAGES ================= */
    let urls = [
      `${baseUrl}`,
      `${baseUrl}/categories`,
      `${baseUrl}/search`,
      `${baseUrl}/blog`,
      `${baseUrl}/amazon-haul`,
      `${baseUrl}/products`,
      `${baseUrl}/sitemap.xml`,
    ];

    /* ================= PRODUCTS ================= */
    const productsSnap = await getDocs(collection(db, "products"));

    const productUrls = productsSnap.docs.map((doc) =>
      `${baseUrl}/product/${doc.id}`
    );

    /* ================= BLOGS (SEO FIX: SLUG SUPPORT) ================= */
    const blogSnap = await getDocs(collection(db, "blog"));

    const blogUrls = blogSnap.docs.map((doc) => {
      const d = doc.data();

      const slug =
        d.slug || doc.id;

      return `${baseUrl}/blog/${slug}`;
    });

    /* ================= CATEGORIES (DEDUP FIX) ================= */
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

    /* ================= MERGE ALL URLS ================= */
    urls = [
      ...new Set([
        ...urls,
        ...productUrls,
        ...blogUrls,
        ...categoryUrls,
      ]),
    ].map(cleanUrl);

    /* ================= LIMIT SAFETY (IndexNow best practice) ================= */
    const chunks = [];
    const chunkSize = 100;

    for (let i = 0; i < urls.length; i += chunkSize) {
      chunks.push(urls.slice(i, i + chunkSize));
    }

    /* ================= SEND TO INDEXNOW ================= */
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

        const text = await response.text();

        results.push({
          count: chunk.length,
          result: text,
        });
      } catch (err) {
        results.push({
          error: err.message,
        });
      }
    }

    /* ================= OPTIONAL GOOGLE PING ================= */
    try {
      await fetch(
        `https://www.google.com/ping?sitemap=${baseUrl}/api/sitemap`
      );
    } catch {}

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      totalUrls: urls.length,
      chunks: chunks.length,
      results,
    });

  } catch (e) {
    console.log("IndexNow Error:", e.message);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
  }
