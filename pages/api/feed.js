import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit, orderBy } from "firebase/firestore";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= SIMPLE MEMORY CACHE ================= */
let cache = null;
let cacheTime = 0;

const CACHE_DURATION = 1000 * 60 * 10; // 10 min

function isValidCache() {
  return cache && Date.now() - cacheTime < CACHE_DURATION;
}

/* ================= SCORE ENGINE ================= */
function score(p = {}) {
  return (
    (p.views || 0) +
    (p.clicks || 0) * 2 +
    (p.orders || 0) * 5 +
    (p.viralBoost ? 50 : 0)
  );
}

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  try {
    /* ===== CACHE HIT ===== */
    if (isValidCache()) {
      return res.status(200).json({
        success: true,
        cached: true,
        data: cache,
      });
    }

    /* ===== FIREBASE FETCH (LIMITED) ===== */
    const snap = await getDocs(
      query(collection(db, "products"), limit(25))
    );

    let products = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        title: d.title || "",
        image: d.image || "",
        price: d.price || 0,
        views: d.views || 0,
        clicks: d.clicks || 0,
        orders: d.orders || 0,
        viralBoost: d.viralBoost || false,
      };
    });

    /* ===== SORT BY TREND ===== */
    products.sort((a, b) => score(b) - score(a));

    /* ===== FINAL OUTPUT ===== */
    const response = {
      trending: products.slice(0, 12),
      homeFeed: products.slice(0, 8),
      products: products.slice(0, 20),
    };

    /* ===== UPDATE CACHE ===== */
    cache = response;
    cacheTime = Date.now();

    return res.status(200).json({
      success: true,
      cached: false,
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
