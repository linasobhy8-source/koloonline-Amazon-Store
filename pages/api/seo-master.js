import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE ================= */
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
const clean = (url) =>
  typeof url === "string" ? url.replace(/\/+$/, "").trim() : "";

/* ================= SAFE FETCH ================= */
async function safeFetch(name, url, options = {}) {
  try {
    const res = await fetch(url, options);

    return {
      name,
      ok: res.ok,
      status: res.status,
      data: await res.text().catch(() => ""),
    };
  } catch (e) {
    return {
      name,
      ok: false,
      error: e.message,
    };
  }
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://koloonline.online";

    const indexKey = process.env.INDEXNOW_KEY;

    /* ================= FETCH DATA ================= */
    const [productsSnap, blogSnap] = await Promise.all([
      getDocs(collection(db, "products")),
      getDocs(collection(db, "blog")),
    ]);

    /* ================= PRODUCT URLS ================= */
    const productUrls = productsSnap.docs.map(
      (d) => `${baseUrl}/product/${d.id}`
    );

    /* ================= BLOG URLS ================= */
    const blogUrls = blogSnap.docs.map((d) => {
      const data = d.data();
      return `${baseUrl}/blog/${data.slug || d.id}`;
    });

    /* ================= STATIC URLS ================= */
    const staticUrls = [
      baseUrl,
      `${baseUrl}/blog`,
      `${baseUrl}/products`,
      `${baseUrl}/search`,
      `${baseUrl}/categories`,
      `${baseUrl}/amazon-haul`,
      `${baseUrl}/fiverr`,
      `${baseUrl}/aliexpress`,
      `${baseUrl}/sitemap.xml`,
    ];

    /* ================= MERGE + CLEAN ================= */
    const allUrls = [...new Set([...staticUrls, ...productUrls, ...blogUrls])]
      .map(clean)
      .filter(Boolean);

    /* ================= LIMIT SAFETY ================= */
    const urlsToSubmit = allUrls.slice(0, 200);

    /* ================= INDEXNOW ================= */
    const indexNow = indexKey
      ? await safeFetch(
          "indexnow",
          "https://api.indexnow.org/indexnow",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              host: "koloonline.online",
              key: indexKey,
              urlList: urlsToSubmit,
            }),
          }
        )
      : { skipped: true, reason: "missing_indexnow_key" };

    /* ================= GOOGLE PING ================= */
    const googlePing = await safeFetch(
      "google",
      `https://www.google.com/ping?sitemap=${encodeURIComponent(
        `${baseUrl}/sitemap.xml`
      )}`
    );

    /* ================= BING PING ================= */
    const bingPing = await safeFetch(
      "bing",
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(
        `${baseUrl}/sitemap.xml`
      )}`
    );

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      engine: "seo-master-v2",

      totalUrls: allUrls.length,
      submittedUrls: urlsToSubmit.length,

      indexNow,
      googlePing,
      bingPing,

      message: "SEO Master Pipeline executed successfully",
    });
  } catch (e) {
    console.error("SEO MASTER ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
