import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

/* ================= AI LEARNING ENGINE ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let updated = 0;

    for (const d of snap.docs) {
      const data = d.data();

      const clicks = data.clicks || 0;
      const orders = data.orders || 0;
      const views = data.views || 0;

      /* ================= LEARNING FORMULA ================= */
      let newScore =
        clicks * 1.2 +
        orders * 5 +
        views * 0.3 +
        (data.rating || 3) * 2;

      /* ================= TREND BOOST ================= */
      if (clicks > 10) newScore *= 1.3;
      if (orders > 3) newScore *= 1.5;

      /* ================= PRICE INTELLIGENCE ================= */
      if (data.price < 50) newScore += 3;
      if (data.price < 20) newScore += 5;

      /* ================= UPDATE ================= */
      await updateDoc(doc(db, "products", d.id), {
        score: newScore,
        lastLearned: new Date(),
      });

      updated++;
    }

    return res.status(200).json({
      success: true,
      message: "🧠 AI Learning Completed",
      updated,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
