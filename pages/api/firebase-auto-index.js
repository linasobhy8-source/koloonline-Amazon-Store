import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const baseUrl = "https://koloonline.online";

/* ================= INDEXNOW SENDER ================= */
async function sendIndexNow(urls) {
  try {
    const key = process.env.INDEXNOW_KEY;

    if (!key) return;

    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: "koloonline.online",
        key,
        urlList: urls,
      }),
    });
  } catch (err) {
    console.error("IndexNow error:", err);
  }
}

/* ================= GOOGLE PING ================= */
async function pingGoogle() {
  try {
    await fetch(
      `https://www.google.com/ping?sitemap=${baseUrl}/sitemap.xml`
    );
  } catch (err) {
    console.error("Google ping error:", err);
  }
}

/* ================= MAIN WATCHER ================= */
export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET only" });
  }

  const productsRef = collection(db, "products");
  const blogRef = collection(db, "blog");

  let lastIndexTime = 0;

  /* ================= WATCH PRODUCTS ================= */
  onSnapshot(productsRef, async (snapshot) => {
    const urls = [];

    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const id = change.doc.id;
        urls.push(`${baseUrl}/product/${id}`);
      }
    });

    if (urls.length > 0 && Date.now() - lastIndexTime > 10000) {
      lastIndexTime = Date.now();

      await sendIndexNow(urls);
      await pingGoogle();

      console.log("🚀 Auto Indexed Products:", urls.length);
    }
  });

  /* ================= WATCH BLOG ================= */
  onSnapshot(blogRef, async (snapshot) => {
    const urls = [];

    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const id = change.doc.id;
        urls.push(`${baseUrl}/blog/${id}`);
      }
    });

    if (urls.length > 0 && Date.now() - lastIndexTime > 10000) {
      lastIndexTime = Date.now();

      await sendIndexNow(urls);
      await pingGoogle();

      console.log("🚀 Auto Indexed Blogs:", urls.length);
    }
  });

  return res.status(200).json({
    success: true,
    message: "Firebase auto-indexing is running",
  });
}
