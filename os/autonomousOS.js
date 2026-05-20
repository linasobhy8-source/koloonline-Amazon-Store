import { autonomousCompanyOS } from "../../os/autonomousOS";

/* ================= DAILY AUTOPILOT ================= */
export default async function handler(req, res) {
  try {
    /* ================= RUN AI COMPANY OS ================= */
    const result = await autonomousCompanyOS();

    return res.status(200).json({
      success: true,
      engine: "V6_REVENUE_OS",
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error) {
    console.error("DAILY_AUTOPILOT_ERROR:", error);

    return res.status(500).json({
      success: false,
      engine: "V6_REVENUE_OS",
      error: error?.message || "UNKNOWN_ERROR",
    });
  }
}
