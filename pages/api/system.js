import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= HELPERS ================= */
function safe(v, fallback = null) {
  return v !== undefined ? v : fallback;
}

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  try {
    const { action } = req.query;

    /* ================= HEALTH CHECK ================= */
    if (action === "health") {
      return res.status(200).json({
        success: true,
        status: "OK",
        time: Date.now(),
      });
    }

    /* ================= TRENDING ================= */
    if (action === "trending") {
      const snap = await getDocs(
        query(collection(db, "products"), limit(20))
      );

      const products = snap.docs.map((d) => {
        const data = d.data();

        return {
          id: d.id,
          title: safe(data.title, ""),
          price: safe(data.price, 0),
          image: safe(data.image, ""),
          views: safe(data.views, 0),
          clicks: safe(data.clicks, 0),
          orders: safe(data.orders, 0),
          viralBoost: safe(data.viralBoost, false),
        };
      });

      return res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    }

    /* ================= SEO SYSTEM ================= */
    if (action === "seo") {
      return res.status(200).json({
        success: true,
        data: {
          title: "Koloonline SEO Engine",
          status: "active",
          indexedPages: 29,
          mode: "production",
        },
      });
    }

    /* ================= DEFAULT ================= */
    return res.status(400).json({
      success: false,
      message: "Invalid action. Use: trending | seo | health",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
