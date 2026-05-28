import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getCache, setCache } from "../../lib/cache";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const cached = getCache("home-feed");
    if (cached) {
      return res.status(200).json(cached);
    }

    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const feed = products.slice(0, 20);

    setCache("home-feed", feed, 120000);

    return res.status(200).json(feed);
  } catch (e) {
    return res.status(500).json([]);
  }
}
