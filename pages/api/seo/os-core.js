import indexNow from "../indexnow";
import pingGoogle from "../ping-google";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= CORE ENGINE ================= */
export default async function handler(req, res) {
  try {
    const mode = req.query.mode || "full";

    const logs = [];

    /* ================= 1. FETCH DATA ================= */
    const productsSnap = await getDocs(collection(db, "products"));
    const blogSnap = await getDocs(collection(db, "blog"));

    const productUrls = productsSnap.docs.map(
      (d) => `https://koloonline.online/product/${d.id}`
    );

    const blogUrls = blogSnap.docs.map(
      (d) => `https://koloonline.online/blog/${d.id}`
    );

    const urls = [...productUrls, ...blogUrls];

    /* ================= 2. INDEXNOW ================= */
    try {
      await indexNow(req, res);
      logs.push("IndexNow executed");
    } catch (e) {
      logs.push("IndexNow error: " + e.message);
    }

    /* ================= 3. GOOGLE PING ================= */
    try {
      await pingGoogle(req, res);
      logs.push("Google ping executed");
    } catch (e) {
      logs.push("Google ping error: " + e.message);
    }

    return res.status(200).json({
      success: true,
      mode,
      totalUrls: urls.length,
      logs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
