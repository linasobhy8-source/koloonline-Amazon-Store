import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";
import { aiFetch, optimizeFeed } from "../../lib/ai-performance-engine";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const data = await aiFetch("home-feed", async () => {
      const snap = await getDocs(
        query(collection(db, "products"), limit(50))
      );

      return snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
    }, 600);

    return res.status(200).json({
      success: true,
      cached: true,
      products: optimizeFeed(data),
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
