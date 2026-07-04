import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

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

/* Ping Google */
async function pingGoogleSitemap() {
  try {
    const url =
      "https://www.google.com/ping?sitemap=https://koloonline.online/sitemap.xml";

    await fetch(url);

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/* IndexNow */
async function sendIndexNow(urls = []) {
  try {
    const payload = {
      host: "koloonline.online",
      key: process.env.INDEXNOW_KEY,
      urlList: urls.slice(0, 50),
    };

    if (!payload.key) {
      return { skipped: true };
    }

    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return {
      success: res.ok,
      status: res.status,
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
}

/* ================= CORE ENGINE ================= */
export default async function handler(req, res) {
  try {
    const mode = req.query.mode || "full";
    const logs = [];

    /* ================= FETCH DATA ================= */
    const productsSnap = await getDocs(collection(db, "products"));
    const blogSnap = await getDocs(collection(db, "blog"));

    const productUrls = productsSnap.docs.map(
      (d) => `https://koloonline.online/product/${d.id}`
    );

    const blogUrls = blogSnap.docs.map(
      (d) => `https://koloonline.online/blog/${d.id}`
    );

    const urls = [...productUrls, ...blogUrls];

    /* ================= INDEXNOW ================= */
    const indexResult = await sendIndexNow(urls);
    logs.push("IndexNow executed");

    /* ================= GOOGLE PING ================= */
    const pingResult = await pingGoogleSitemap();
    logs.push("Google ping executed");

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      mode,
      totalUrls: urls.length,
      indexNow: indexResult,
      googlePing: pingResult,
      logs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
      }
