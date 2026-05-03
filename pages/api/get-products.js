import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

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
    const { category, max = 50 } = req.query;

    let q;

    /* ================= QUERY ================= */
    if (category) {
      q = query(
        collection(db, "products"),
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

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
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
