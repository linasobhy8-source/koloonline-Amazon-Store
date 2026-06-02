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
  return typeof url === "string"
    ? url.replace(/\/+$/, "").trim()
    : null;
}

function safeString(v) {
  return typeof v === "string" && v.trim().length > 0
    ? v.trim()
    : null;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const startTime = Date.now();

  try {
    const key = process.env.INDEXNOW_KEY;
    const baseUrl = "https://koloonline.online";

    if (!key) {
      return res.status(500).json({
        success: false,
        error: "Missing INDEXNOW_KEY",
      });
    }

    /* ================= STATIC CORE PAGES ================= */
    const staticUrls = [
      baseUrl,
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
      .map((doc) => {
        const id = safeString(doc.id);
        return id ? `${baseUrl}/product/${id}` : null;
      })
      .filter(Boolean)
      .slice(0, 200);

    /* ================= BLOGS ================= */
    const blogSnap = await getDocs(collection(db, "blog"));

    const blogUrls = blogSnap.docs
      .map((doc) => {
        const data = doc.data();
        const slug = safeString(data?.slug || doc.id);

        return slug ? `${baseUrl}/blog/${slug}` : null;
      })
      .filter(Boolean)
      .slice(0, 150);

    /* ================= CATEGORIES ================= */
    const categoriesSnap = await getDocs(collection(db, "products"));

    const categoryUrls = [
      ...new Set(
        categoriesSnap.docs
          .map((doc) => {
            const cat = safeString(doc.data()?.category);
            return cat
              ? `${baseUrl}/category/${cat.toLowerCase()}`
              : null;
          })
          .filter(Boolean)
      ),
    ];

    /* ================= MERGE ALL ================= */
    const allUrls = [
      ...new Set([...staticUrls, ...productUrls, ...blogUrls, ...categoryUrls]),
    ]
      .map(cleanUrl)
      .filter(Boolean);

    /* ================= PRIORITY FILTER ================= */
    const priorityUrls = allUrls.filter(
      (u) =>
        u.includes("/product/") ||
        u.includes("/blog/") ||
        u.includes("/category/") ||
        u === baseUrl
    );

    /* ================= CHUNKING ================= */
    const chunkSize = 50;
    const chunks = [];

    for (let i = 0; i < priorityUrls.length; i += chunkSize) {
      chunks.push(priorityUrls.slice(i, i + chunkSize));
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
          ok: response.ok,
        });
      } catch (err) {
        results.push({
          error: err?.message || "IndexNow chunk failed",
        });
      }
    }

    /* ================= GOOGLE PING ================= */
    try {
      await fetch(
        "https://www.google.com/ping?sitemap=https://koloonline.online/sitemap.xml"
      );
    } catch (e) {
      results.push({
        googlePingError: e?.message,
      });
    }

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      runtime: Date.now() - startTime,
      totalUrls: allUrls.length,
      indexedUrls: priorityUrls.length,
      chunks: chunks.length,
      results,
    });

  } catch (e) {
    console.error("IndexNow Error:", e);

    return res.status(500).json({
      success: false,
      error: e?.message || "Unknown error",
    });
  }
  }
