import { brainOS } from "../../../lib/ai/brainOS";

/* ================= AI START ENDPOINT ================= */
export default async function handler(req, res) {
  try {
    // منع التشغيل المتكرر
    if (global.__AI_RUNNING__) {
      return res.status(200).json({
        success: true,
        message: "AI Brain already running",
      });
    }

    global.__AI_RUNNING__ = true;

    // تشغيل الـ Brain في الخلفية
    brainOS();

    return res.status(200).json({
      success: true,
      message: "🧠 AI Brain Started Successfully",
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
