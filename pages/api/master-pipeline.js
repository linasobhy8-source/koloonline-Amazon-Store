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

/* ================= SAFE RUN ================= */
async function safeRun(label, fn, retries = 2) {
  let lastError;

  for (let i = 0; i <= retries; i++) {
    try {
      const result = await fn();
      return {
        success: true,
        label,
        attempts: i + 1,
        result,
      };
    } catch (err) {
      lastError = err;
      if (i === retries) {
        return {
          success: false,
          label,
          error: err.message,
          attempts: i + 1,
        };
      }
    }
  }

  return {
    success: false,
    label,
    error: lastError?.message || "Unknown error",
  };
}

/* ================= INDEXNOW DIRECT ================= */
async function runIndexNow(urls) {
  const key = process.env.INDEXNOW_KEY;
  const host = "koloonline.online";

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      host,
      key,
      urlList: urls.slice(0, 100),
    }),
  });

  return {
    status: res.status,
    body: await res.text(),
  };
}

/* ================= GOOGLE PING ================= */
async function runGooglePing() {
  const url = "https://koloonline.online/sitemap.xml";

  await fetch(
    `https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`
  );

  return { pinged: true };
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";

    /* ================= FETCH ================= */
    const productsSnap = await getDocs(collection(db, "products"));
    const blogSnap = await getDocs(collection(db, "blog"));

    const products = productsSnap.docs.map((d) => d.id);
    const blogs = blogSnap.docs.map((d) => d.id);

    const urls = [
      baseUrl,
      `${baseUrl}/blog`,
      `${baseUrl}/products`,
      `${baseUrl}/categories`,
      `${baseUrl}/search`,
      ...products.map((id) => `${baseUrl}/product/${id}`),
      ...blogs.map((id) => `${baseUrl}/blog/${id}`),
    ];

    const logs = [];

    /* ================= INDEXNOW ================= */
    const indexNowResult = await safeRun("IndexNow", () =>
      runIndexNow(urls)
    );

    logs.push(indexNowResult);

    /* ================= GOOGLE PING ================= */
    const googleResult = await safeRun("GooglePing", () =>
      runGooglePing()
    );

    logs.push(googleResult);

    /* ================= AUTO VALIDATION ================= */
    const invalidUrls = urls.filter(
      (u) => !u || u.includes("undefined")
    );

    if (invalidUrls.length) {
      logs.push({
        warning: "Invalid URLs detected",
        count: invalidUrls.length,
      });
    }

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Auto SEO System executed successfully",
      totalUrls: urls.length,
      indexNow: indexNowResult,
      googlePing: googleResult,
      logs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
    }
