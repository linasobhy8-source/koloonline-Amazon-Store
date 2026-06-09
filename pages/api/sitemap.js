import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getCountFromServer } from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= FAST COUNT (NO FULL LOAD) ================= */
async function safeCount(collectionName) {
  try {
    const coll = collection(db, collectionName);
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count || 0;
  } catch (e) {
    console.error(`Error counting ${collectionName}:`, e);
    return 0;
  }
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }

    /* ================= PARALLEL ================= */
    const [productsCount, blogsCount] = await Promise.all([
      safeCount("products"),
      safeCount("blog"),
    ]);

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      stats: {
        productsCount,
        blogsCount,
        totalContent: productsCount + blogsCount,
      },
      urls: [
        "https://koloonline.online/",
        "https://koloonline.online/blog",
        "https://koloonline.online/products",
      ],
      timestamp: Date.now(),
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Unknown error",
    });
  }
}
