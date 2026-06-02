import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function brainOS() {
  try {
    console.log("🧠 BrainOS v2 running...");

    const metrics = {
      loop: 0,
      lastRun: Date.now(),
      score: 0,
    };

    /* ================= MAIN LOOP ================= */
    setInterval(async () => {
      metrics.loop++;

      // Simulated intelligence (تقدر تربطه ببياناتك الحقيقية)
      const decisionScore = Math.random() * 100;

      metrics.score = decisionScore;

      // تسجيل كل دورة
      await addDoc(collection(db, "brain_activity"), {
        loop: metrics.loop,
        score: decisionScore,
        timestamp: Date.now(),
        createdAt: serverTimestamp(),
      });

      console.log(`Brain Loop ${metrics.loop} | Score: ${decisionScore}`);

      /* ================= SELF OPTIMIZATION ================= */

      if (decisionScore > 80) {
        await addDoc(collection(db, "brain_actions"), {
          action: "boost_product",
          reason: "high_score_detected",
          score: decisionScore,
          timestamp: Date.now(),
        });
      }

      if (decisionScore < 30) {
        await addDoc(collection(db, "brain_actions"), {
          action: "change_strategy",
          reason: "low_score_detected",
          score: decisionScore,
          timestamp: Date.now(),
        });
      }

    }, 10000); // كل 10 ثواني

  } catch (error) {
    console.error("BrainOS error:", error);
  }
                                }
