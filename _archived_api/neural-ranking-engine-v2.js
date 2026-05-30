import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= NEURAL RANKING ENGINE v2 ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let updated = 0;
    const now = Date.now();

    for (const d of snap.docs) {
      const p = d.data();

      const clicks = Number(p.clicks || 0);
      const orders = Number(p.orders || 0);
      const views = Number(p.views || 0);
      const rating = Number(p.rating || 3);
      const price = Number(p.price || 0);

      const lastUpdated = p.lastLearned?.toDate?.() || new Date(0);
      const ageHours = (now - lastUpdated.getTime()) / (1000 * 60 * 60);

      /* ================= 1. BASE NEURAL SCORE ================= */
      let score =
        clicks * 1.5 +
        orders * 6 +
        views * 0.4 +
        rating * 2;

      /* ================= 2. TREND MOMENTUM ================= */
      const conversionRate =
        clicks > 0 ? orders / clicks : 0;

      const momentumBoost =
        conversionRate > 0.2 ? 10 :
        conversionRate > 0.1 ? 5 :
        0;

      score += momentumBoost;

      /* ================= 3. TIME DECAY ================= */
      const decay = Math.max(0.7, 1 - ageHours / 72);
      score *= decay;

      /* ================= 4. PRICE INTELLIGENCE ================= */
      if (price > 0 && price < 50) score += 4;
      if (price > 0 && price < 20) score += 6;
      if (price > 200) score -= 3;

      /* ================= 5. DEAD PRODUCT PENALTY ================= */
      if (clicks === 0 && views > 10) score -= 5;
      if (clicks === 0 && orders === 0 && views > 20) score -= 8;

      /* ================= 6. VIRAL BOOST ================= */
      if (clicks > 50) score += 10;
      if (orders > 10) score += 15;

      /* ================= 7. SAFETY CHECK ================= */
      if (isNaN(score) || !isFinite(score)) {
        score = rating * 2;
      }

      const isHot = score > 25;

      /* ================= UPDATE ================= */
      await updateDoc(doc(db, "products", d.id), {
        score,
        isHot,
        lastLearned: serverTimestamp(),

        conversionRate,
        momentumBoost,
        decayFactor: decay,
      });

      updated++;
    }

    return res.status(200).json({
      success: true,
      message: "🔥 Neural Ranking Engine v2 Completed",
      updated,
    });

  } catch (err) {
    console.error("NEURAL ENGINE ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
          }
