import pingGoogle from "./ping-google";
import indexNow from "./indexnow";

/* ================= MASTER SEO CONTROLLER ================= */
export default async function handler(req, res) {
  try {
    const results = {
      google: null,
      indexNow: null,
      timestamp: new Date().toISOString(),
    };

    /* ================= GOOGLE PING ================= */
    try {
      const googleRes = await pingGoogle(req, res);
      results.google = "sent";
    } catch (e) {
      results.google = e.message;
    }

    /* ================= INDEXNOW ================= */
    try {
      const indexRes = await indexNow(req, res);
      results.indexNow = "sent";
    } catch (e) {
      results.indexNow = e.message;
    }

    return res.status(200).json({
      success: true,
      message: "SEO Master Controller executed safely",
      results,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
