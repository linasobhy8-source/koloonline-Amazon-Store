import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

/* ================= FIREBASE ================= */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const db = getFirestore(app);

/* ================= SAFE LEARNING ENGINE ================= */

function adjustWeight(stats) {
  let weight = 1;

  const views = Number(stats.views || 0);
  const clicks = Number(stats.clicks || 0);
  const orders = Number(stats.orders || 0);
  const revenue = Number(stats.revenue || 0);

  // 🔥 Prevent division issues + noise filtering
  if (views < 5) return 0.8; // low data → low trust

  // ================= CORE SIGNALS =================
  if (orders > views * 0.05) weight += 0.25;
  if (clicks > views * 0.2) weight += 0.15;
  if (orders > 0 && clicks > 0) weight += 0.1;

  // ================= MONEY SIGNAL =================
  if (revenue > 100) weight += 0.35;
  if (revenue > 500) weight += 0.2;

  // ================= ENGAGEMENT QUALITY =================
  const ctr = views > 0 ? clicks / views : 0;
  const cvr = clicks > 0 ? orders / clicks : 0;

  if (ctr > 0.25) weight += 0.2;
  if (cvr > 0.1) weight += 0.25;

  // ================= LIMIT SAFETY =================
  if (weight > 2) weight = 2;
  if (weight < 0.5) weight = 0.5;

  return Number(weight.toFixed(3));
}

/* ================= HANDLER ================= */

export default async function handler(req, res) {
  try {
    const snap = await getDocs(
      collection(db, "analytics_products")
    );

    let processed = 0;
    let skipped = 0;

    for (const d of snap.docs) {
      const data = d.data();

      const stats = {
        views: data.views || 0,
        clicks: data.clicks || 0,
        orders: data.orders || 0,
        revenue: data.revenue || 0,
      };

      /* ================= SKIP NOISE ================= */
      if (stats.views < 3 && stats.clicks < 1) {
        skipped++;
        continue;
      }

      const newWeight = adjustWeight(stats);

      const ref = doc(
        db,
        "analytics_products",
        d.id
      );

      await updateDoc(ref, {
        learningWeight: newWeight,
        updatedAt: Date.now(),
        qualityScore:
          stats.views + stats.clicks * 2 + stats.orders * 5,
      });

      processed++;
    }

    return res.status(200).json({
      success: true,
      processed,
      skipped,
      total: snap.size,
      message: "Learning engine optimized successfully",
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
