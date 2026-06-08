import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= SAFE FETCH ================= */
async function safeCount(collectionName) {
  try {
    const snap = await getDocs(collection(db, collectionName));
    return snap?.size || 0;
  } catch (e) {
    console.error(`Error fetching ${collectionName}:`, e);
    return 0;
  }
}

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  try {
    // 🔒 Only POST allowed
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }

    /* ================= PARALLEL FETCH ================= */
    const [productsCount, blogsCount] = await Promise.all([
      safeCount("products"),
      safeCount("blog"),
    ]);

    /* ================= BASE URLS ================= */
    const baseUrls = [
      "https://koloonline.online/",
      "https://koloonline.online/blog",
      "https://koloonline.online/products",
    ];

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      stats: {
        productsCount,
        blogsCount,
        totalContent: productsCount + blogsCount,
      },
      urls: baseUrls,
      timestamp: Date.now(),
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Unknown error",
    });
  }
        }
