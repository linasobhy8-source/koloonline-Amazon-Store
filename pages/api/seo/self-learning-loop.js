export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";

    console.log("🧠 SELF LEARNING LOOP START");

    /* ================= COLLECT SIGNALS ================= */
    const signals = await fetch(`${baseUrl}/api/seo/revenue-os`);
    const data = await signals.json().catch(() => ({}));

    /* ================= SIMPLE LEARNING RULE ================= */
    let improvement = "stable";

    if (data?.revenue > 100) {
      improvement = "increase_ads_density";
    }

    if (data?.bounceRate > 70) {
      improvement = "reduce_ads";
    }

    if (data?.ctr > 5) {
      improvement = "scale_traffic";
    }

    /* ================= FEEDBACK TO SYSTEM ================= */
    await fetch(`${baseUrl}/api/seo/v6-seo-brain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "self-learning",
        signal: improvement,
      }),
    });

    return res.status(200).json({
      success: true,
      decision: improvement,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
