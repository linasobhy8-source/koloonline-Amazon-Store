export default async function handler(req, res) {
  try {
    const { type, id, url } = req.body;

    if (!type || !id) {
      return res.status(400).json({
        success: false,
        error: "Missing type or id",
      });
    }

    const baseUrl = "https://koloonline.online";

    /* ================= 1️⃣ AUTO INDEX ================= */
    await fetch(`${baseUrl}/api/auto-index`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });

    /* ================= 2️⃣ UPDATE SITEMAP ================= */
    await fetch(`${baseUrl}/api/sitemap`, {
      method: "POST",
    });

    /* ================= 3️⃣ GOOGLE PING ================= */
    await fetch(`${baseUrl}/api/ping-google`, {
      method: "POST",
    });

    /* ================= 4️⃣ LOG ================= */
    await fetch(`${baseUrl}/api/cron-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "master_pipeline",
        status: "success",
        target: url || `${baseUrl}/${type}/${id}`,
        createdAt: new Date().toISOString(),
      }),
    });

    console.log("🚀 MASTER PIPELINE DONE:", type, id);

    return res.status(200).json({
      success: true,
      message: "Pipeline executed successfully",
      url: url || `${baseUrl}/${type}/${id}`,
    });

  } catch (e) {
    console.error("MASTER PIPELINE ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
