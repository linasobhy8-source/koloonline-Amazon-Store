import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= HELPERS ================= */
function safeString(v) {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function cleanUrl(url) {
  if (!url || typeof url !== "string") return null;
  return url.replace(/\/+$/, "").trim();
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const start = Date.now();

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    const INDEXNOW_KEY = process.env.INDEXNOW_KEY;

    if (!INDEXNOW_KEY) {
      return res.status(500).json({
        success: false,
        error: "Missing INDEXNOW_KEY",
      });
    }

    const baseUrl = "https://koloonline.online";

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    /* ================= STATIC URLS ================= */
    const urlSet = new Set([
      baseUrl,
      `${baseUrl}/blog`,
      `${baseUrl}/products`,
      `${baseUrl}/categories`,
      `${baseUrl}/search`,
      `${baseUrl}/amazon-haul`,
      `${baseUrl}/aliexpress`,
      `${baseUrl}/fiverr`,
    ]);

    /* ================= FIRESTORE ================= */
    const [productsSnap, blogSnap] = await Promise.all([
      getDocs(collection(db, "products")),
      getDocs(collection(db, "blog")),
    ]);

    /* ================= PRODUCTS ================= */
    productsSnap.docs.forEach((doc) => {
      const id = safeString(doc.id);
      if (id) urlSet.add(`${baseUrl}/product/${id}`);

      const category = safeString(doc.data()?.category);
      if (category) {
        urlSet.add(
          `${baseUrl}/category/${encodeURIComponent(
            category.toLowerCase()
          )}`
        );
      }
    });

    /* ================= BLOG ================= */
    blogSnap.docs.forEach((doc) => {
      const data = doc.data();
      const slug = safeString(data?.slug || doc.id);
      if (slug) urlSet.add(`${baseUrl}/blog/${slug}`);
    });

    /* ================= CLEAN URLS ================= */
    const allUrls = [...urlSet]
      .map(cleanUrl)
      .filter(Boolean);

    /* ================= PRIORITY URLS ================= */
    const priorityUrls = allUrls.filter(
      (url) =>
        url === baseUrl ||
        url.includes("/product/") ||
        url.includes("/blog/") ||
        url.includes("/category/")
    );

    /* ================= CHUNK ================= */
    const CHUNK_SIZE = 100;
    const chunks = [];

    for (let i = 0; i < priorityUrls.length; i += CHUNK_SIZE) {
      chunks.push(priorityUrls.slice(i, i + CHUNK_SIZE));
    }

    /* ================= INDEXNOW ================= */
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
              key: INDEXNOW_KEY,
              urlList: chunk,
            }),
          }
        );

        results.push({
          status: response.status,
          ok: response.ok,
          urls: chunk.length,
        });
      } catch (err) {
        results.push({
          ok: false,
          error: err?.message || "IndexNow Request Failed",
        });
      }
    }

    /* ================= GOOGLE PING ================= */
    fetch(
      `https://www.google.com/ping?sitemap=https://koloonline.online/sitemap.xml`
    ).catch(() => {});

    return res.status(200).json({
      success: true,
      runtime: Date.now() - start,
      totalUrls: allUrls.length,
      indexedUrls: priorityUrls.length,
      chunks: chunks.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error",
    });
  }
      }
