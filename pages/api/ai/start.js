import { brainOS } from "../../../lib/ai/brainOS";
import { db } from "../../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/* ================= AI START ENDPOINT (BRAIN V2) ================= */
export default async function handler(req, res) {
  try {
    // منع التكرار
    if (global.__AI_RUNNING__) {
      return res.status(200).json({
        success: true,
        status: "already_running",
      });
    }

    global.__AI_RUNNING__ = true;

    const startTime = Date.now();

    // تشغيل brain
    brainOS();

    // تسجيل تشغيل الـ brain
    await addDoc(collection(db, "brain_logs"), {
      event: "brain_started",
      timestamp: startTime,
      createdAt: serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      message: "🧠 BrainOS v2 Started",
      version: "2.0",
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
      }
