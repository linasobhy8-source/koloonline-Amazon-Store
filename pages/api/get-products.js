import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where
} from "firebase/firestore";

/* ================= FIREBASE INIT (SAFE) ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= MEMORY CACHE (FAST BOOST) ================= */
let cache = null;
let cacheTime = 0;

const CACHE_TTL = 1000 * 60 * 3; // 3 minutes

function isCacheValid() {
  return cache && Date.now() - cacheTime < CACHE_TTL;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const { category, max = 30 } = req.query;

    /* ================= RETURN CACHE ================= */
    if (isCacheValid() && !category) {
      return res.status(200).json({
        success: true,
        source: "cache",
        products: cache,
      });
    }

    let q;

    /* ================= FAST QUERY ================= */
    if (category) {
      q = query(
        collection(db, "products"),
        where("category", "==", category),
        orderBy("createdAt", "desc"),
        limit(Number(max))
      );
    } else {
      q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc"),
        limit(Number(max))
      );
    }

    const snapshot = await getDocs(q);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    /* ================= UPDATE CACHE ================= */
    if (!category) {
      cache = products;
      cacheTime = Date.now();
    }

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      source: category ? "firebase-filtered" : "firebase",
      count: products.length,
      products,
    });

  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
        }
