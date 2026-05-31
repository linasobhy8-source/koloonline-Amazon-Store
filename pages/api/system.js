import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit
} from "firebase/firestore";

import { productBrain } from "../../lib/ai/productBrain";
import { detectVirals } from "../../lib/ai/viralDetector";

const app = !getApps().length
  ? initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
  : getApps()[0];

const db = getFirestore(app);

export default async function handler(req, res) {
  const { action } = req.query;

  try {
    if (action === "feed") {
      const snap = await getDocs(
        query(collection(db, "products"), limit(120))
      );

      let products = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      // 🧠 AI ENGINE
      products = productBrain(products);

      // 🔥 VIRAL FILTER
      const virals = detectVirals(products);

      // ترتيب حسب القوة
      products.sort((a, b) => b.score - a.score);

      return res.json({
        success: true,
        data: products.slice(0, 20),
        viral: virals.slice(0, 5),
      });
    }

    if (action === "trending") {
      const snap = await getDocs(
        query(collection(db, "products"), limit(50))
      );

      let products = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      const trending = productBrain(products)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      return res.json({
        success: true,
        trending,
      });
    }

    return res.status(400).json({ success: false });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
