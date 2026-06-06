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
function clean(url) {
  return url?.replace(/\/+$/, "").trim();
}

/* ================= SAFE FETCH ================= */
async function safeFetch(name, url, options) {
  try {
    const res = await fetch(url, options);
    return {
      name,
      ok: true,
      status: res.status,
      text: await res.text(),
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
    const baseUrl = "https://koloonline.online";
    const indexKey = process.env.INDEXNOW_KEY;

    /* ================= COLLECT DATA ================= */
    const productsSnap = await getDocs(collection(db, "products"));
    const blogSnap = await getDocs(collection(db, "blog"));

    const productUrls = productsSnap.docs.map(
      (d) => `${baseUrl}/product/${d.id}`
    );

    const blogUrls = blogSnap.docs.map((d) => {
      const data = d.data();
      return `${baseUrl}/blog/${data.slug || d.id}`;
    });

    const staticUrls = [
      `${baseUrl}`,
      `${baseUrl}/blog`,
      `${baseUrl}/products`,
      `${baseUrl}/search`,
      `${baseUrl}/categories`,
      `${baseUrl}/amazon-haul`,
      `${baseUrl}/fiverr`,
      `${baseUrl}/aliexpress`,
      `${baseUrl}/sitemap.xml`,
    ];

    const allUrls = [...new Set([...staticUrls, ...productUrls, ...blogUrls])]
      .map(clean)
      .filter(Boolean);

    /* ================= INDEXNOW ================= */
    const indexNowResult = await safeFetch(
      "indexnow",
      "https://api.indexnow.org/indexnow",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: "koloonline.online",
          key: indexKey,
          urlList: allUrls.slice(0, 200),
        }),
      }
    );

    /* ================= GOOGLE PING ================= */
    const googlePing = await safeFetch(
      "google-ping",
      `https://www.google.com/ping?sitemap=${encodeURIComponent(
        `${baseUrl}/sitemap.xml`
      )}`
    );

    /* ================= BING PING (ADDED STABILITY BOOST) ================= */
    const bingPing = await safeFetch(
      "bing-ping",
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(
        `${baseUrl}/sitemap.xml`
      )}`
    );

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      totalUrls: allUrls.length,
      indexNow: indexNowResult,
      google: googlePing,
      bing: bingPing,
      message: "SEO Master Pipeline executed successfully",
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
