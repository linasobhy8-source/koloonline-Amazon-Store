import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= AI LEARNING ENGINE ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let updated = 0;

    for (const d of snap.docs) {
      const data = d.data();

      const clicks = Number(data.clicks || 0);
      const orders = Number(data.orders || 0);
      const views = Number(data.views || 0);
      const rating = Number(data.rating || 3);
      const price = Number(data.price || 0);

      /* ================= BASE SCORE ================= */
      let newScore =
        clicks * 1.2 +
        orders * 5 +
        views * 0.3 +
        rating * 2;

      /* ================= BEHAVIOR BOOST ================= */
      if (clicks > 10) newScore *= 1.3;
      if (clicks > 30) newScore *= 1.5;

      if (orders > 3) newScore *= 1.5;
      if (orders > 10) newScore *= 2;

      /* ================= PRICE INTELLIGENCE ================= */
      if (price > 0 && price < 50) newScore += 3;
      if (price > 0 && price < 20) newScore += 5;
      if (price > 200) newScore -= 2;

      /* ================= DATA VALIDATION ================= */
      if (!newScore || isNaN(newScore)) {
        newScore = rating * 2;
      }

      /* ================= UPDATE FIRESTORE ================= */
      await updateDoc(doc(db, "products", d.id), {
        score: newScore,
        lastLearned: serverTimestamp(),
      });

      updated++;
    }

    return res.status(200).json({
      success: true,
      message: "🧠 AI Learning Engine Completed Successfully",
      updated,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
