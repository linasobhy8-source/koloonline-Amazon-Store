import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= SIMPLE LEARNING ENGINE ================= */
function adjustWeight(stats) {
  let weight = 1;

  if (stats.orders > stats.views * 0.05) weight += 0.2;
  if (stats.clicks > stats.views * 0.2) weight += 0.1;
  if (stats.revenue > 100) weight += 0.3;

  if (weight > 2) weight = 2;
  return weight;
}

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "analytics_products"));

    let improved = 0;

    for (const d of snap.docs) {
      const data = d.data();

      const stats = {
        views: data.views || 0,
        clicks: data.clicks || 0,
        orders: data.orders || 0,
        revenue: data.revenue || 0,
      };

      const newWeight = adjustWeight(stats);

      await updateDoc(doc(db, "analytics_products", d.id), {
        learningWeight: newWeight,
        updatedAt: new Date(),
      });

      improved++;
    }

    return res.status(200).json({
      success: true,
      processed: improved,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
