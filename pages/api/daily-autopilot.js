import { autonomousOS } from "../../os/autonomousOS.js";

/* ================= AUTO RUNNER ================= */
export default async function handler(req, res) {

  // السماح فقط بـ GET
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {

    // تشغيل النظام
    const result = await autonomousOS();

    return res.status(200).json({
      success: true,
      timestamp: Date.now(),
      result,
    });

  } catch (e) {

    console.error("AUTO PILOT ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message || "Internal Server Error",
    });

  }
}
