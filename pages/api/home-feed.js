import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= CACHE ================= */
let cache = null;
let lastFetch = 0;
const CACHE_TIME = 1000 * 60 * 15;

export default async function handler(req, res) {
  try {
    const now = Date.now();

    if (cache && now - lastFetch < CACHE_TIME) {
      return res.status(200).json({ success: true, data: cache });
    }

    const snap = await getDocs(
      query(collection(db, "products"), limit(15))
    );

    const data = snap.docs.map((d) => ({
      id: d.id,
      title: d.data().title || "",
      image: d.data().image || "",
      price: d.data().price || 0,
    }));

    cache = data;
    lastFetch = now;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
