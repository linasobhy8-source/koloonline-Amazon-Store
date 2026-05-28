import { aiFetch, optimizeFeed } from "../../lib/ai-performance-engine";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const app = !getApps().length ? initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
}) : getApps()[0];

const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const data = await aiFetch("products", async () => {
      const snap = await getDocs(collection(db, "products"));

      return snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
    }, 900);

    return res.status(200).json({
      success: true,
      products: optimizeFeed(data),
    });
  } catch (e) {
    return res.status(500).json({ success: false });
  }
}
