import autonomousOS from "../../os/autonomousOS";

/* ================= AUTO PILOT API ================= */

export default async function handler(req, res) {
  try {
    const result = await autonomousOS();

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("daily-autopilot error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
