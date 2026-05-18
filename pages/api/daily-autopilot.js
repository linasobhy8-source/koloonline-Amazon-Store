import { autonomousOS } from "../../os/autonomousOS";

/* ================= AUTO RUNNER ================= */
export default async function handler(req, res) {
  try {
    const result = await autonomousOS();

    return res.status(200).json({
      success: true,
      timestamp: Date.now(),
      result,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
