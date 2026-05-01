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

    // optional external sync
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

/* ================= DEEP AI ENGINE ================= */
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

      /* ================= BASE SCORE ================= */
      let score =
        clicks * 1.5 +
        orders * 6 +
        views * 0.4 +
        rating * 2.5;

      /* ================= DEEP LEARNING BOOST ================= */
      const engagement = clicks + views / 10 + orders * 2;

      if (engagement > 50) score *= 1.4;
      if (engagement > 120) score *= 1.7;

      /* ================= TREND INTELLIGENCE ================= */
      if (price > 0 && price < 25) score += 8;
      else if (price < 60) score += 4;
      else if (price > 250) score -= 3;

      /* ================= QUALITY FILTER ================= */
      if (!score || isNaN(score)) {
        score = rating * 2;
      }

      /* ================= STATUS ENGINE ================= */
      let status = "active";

      if (score < 6 && clicks === 0 && views > 60) {
        status = "disabled";
        flagged++;
      }

      if (score > 18 || orders > 8) {
        status = "boosted";
        boosted++;
      }

      /* ================= UPDATE ================= */
      await updateDoc(doc(db, "products", d.id), {
        score,
        status,
        lastDeepLearned: serverTimestamp(),
      });

      updated++;
    }

    /* ================= LOG RESULT ================= */
    await writeCronLog({
      job: "ai-learning-engine-deep",
      status: "success",
      updated,
      boosted,
      flagged,
      message: "Deep AI Learning Engine Completed",
    });

    return res.status(200).json({
      success: true,
      message: "🧠 Deep AI Engine Completed",
      updated,
      boosted,
      flagged,
    });

  } catch (err) {
    console.error("Deep AI Error:", err);

    await writeCronLog({
      job: "ai-learning-engine-deep",
      status: "error",
      message: err.message,
    });

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
