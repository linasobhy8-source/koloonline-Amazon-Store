import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= AI LEARNING ENGINE V2 ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let updated = 0;
    let boosted = 0;
    let flagged = 0;

    for (const d of snap.docs) {
      const data = d.data();

      const clicks = Number(data.clicks || 0);
      const orders = Number(data.orders || 0);
      const views = Number(data.views || 0);
      const rating = Number(data.rating || 3);
      const price = Number(data.price || 0);

      let score = 0;

      /* ================= BASE AI SCORE ================= */
      score =
        clicks * 1.2 +
        orders * 5 +
        views * 0.3 +
        rating * 2;

      /* ================= BEHAVIOR LEARNING ================= */
      if (clicks > 10) score *= 1.3;
      if (clicks > 30) score *= 1.6;

      if (orders > 3) score *= 1.5;
      if (orders > 10) score *= 2;

      if (views > 100) score += 2;

      /* ================= PRICE INTELLIGENCE ================= */
      if (price > 0 && price < 20) score += 6;
      else if (price < 50) score += 3;
      else if (price > 200) score -= 2;

      /* ================= QUALITY CHECK ================= */
      if (!score || isNaN(score)) {
        score = rating * 2;
      }

      /* ================= AUTO STATUS ENGINE ================= */
      let status = "active";

      if (score < 5 && clicks === 0 && views > 50) {
        status = "disabled"; // weak product
        flagged++;
      }

      if (score > 15 || orders > 5) {
        status = "boosted"; // strong product
        boosted++;
      }

      /* ================= UPDATE FIRESTORE ================= */
      await updateDoc(doc(db, "products", d.id), {
        score,
        status,
        lastLearned: serverTimestamp(),
      });

      updated++;
    }

    return res.status(200).json({
      success: true,
      message: "🧠 AI Learning Engine V2 Completed",
      updated,
      boosted,
      flagged,
    });

  } catch (err) {
    console.error("AI Engine Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
