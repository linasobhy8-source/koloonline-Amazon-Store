import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs
} from "firebase/firestore";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const key = process.env.INDEXNOW_KEY;

    /* ================= STATIC URLS ================= */
    let urls = [
      "https://koloonline.online",
      "https://koloonline.online/categories",
      "https://koloonline.online/search",
      "https://koloonline.online/blog",
    ];

    /* ================= PRODUCTS ================= */
    const productsSnap = await getDocs(collection(db, "products"));

    const productUrls = productsSnap.docs.map((doc) =>
      `https://koloonline.online/product/${doc.id}`
    );

    /* ================= BLOGS ================= */
    const blogSnap = await getDocs(collection(db, "blog"));

    const blogUrls = blogSnap.docs.map((doc) =>
      `https://koloonline.online/blog/${doc.id}`
    );

    /* ================= MERGE ================= */
    urls = [...urls, ...productUrls, ...blogUrls];

    /* ================= SEND TO INDEXNOW ================= */
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        host: "koloonline.online",
        key,
        urlList: urls,
      }),
    });

    const data = await response.text();

    console.log("⚡ IndexNow Sent:", data);

    return res.status(200).json({
      success: true,
      totalUrls: urls.length,
      result: data
    });

  } catch (e) {
    console.log("IndexNow Error:", e.message);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
