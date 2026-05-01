import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";

/* ================= LOG HELPER ================= */
async function writeCronLog(data) {
  try {
    await addDoc(collection(db, "cron_logs"), {
      ...data,
      createdAt: serverTimestamp(),
    });

    // optional external sync (if you have endpoint)
    if (process.env.DOMAIN) {
      await fetch(`${process.env.DOMAIN}/api/cron-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => {});
    }
  } catch (e) {
    console.log("log error:", e.message);
  }
}

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

      let score =
        clicks * 1.2 +
        orders * 5 +
        views * 0.3 +
        rating * 2;

      if (clicks > 10) score *= 1.3;
      if (clicks > 30) score *= 1.6;

      if (orders > 3) score *= 1.5;
      if (orders > 10) score *= 2;

      if (views > 100) score += 2;

      if (price > 0 && price < 20) score += 6;
      else if (price < 50) score += 3;
      else if (price > 200) score -= 2;

      if (!score || isNaN(score)) {
        score = rating * 2;
      }

      let status = "active";

      if (score < 5 && clicks === 0 && views > 50) {
        status = "disabled";
        flagged++;
      }

      if (score > 15 || orders > 5) {
        status = "boosted";
        boosted++;
      }

      await updateDoc(doc(db, "products", d.id), {
        score,
        status,
        lastLearned: serverTimestamp(),
      });

      updated++;
    }

    /* ================= FINAL CRON LOG ================= */
    await writeCronLog({
      job: "ai-learning-engine-v2",
      status: "success",
      updated,
      boosted,
      flagged,
      message: "AI Learning Engine V2 Completed",
    });

    return res.status(200).json({
      success: true,
      message: "🧠 AI Learning Engine V2 Completed",
      updated,
      boosted,
      flagged,
    });

  } catch (err) {
    console.error("AI Engine Error:", err);

    await writeCronLog({
      job: "ai-learning-engine-v2",
      status: "error",
      message: err.message,
    });

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
          }
