export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";

    console.log("⏱️ SEO CRON AUTOMATION STARTED");

    /* ================= 1️⃣ DEFINE CYCLE STRATEGY ================= */
    const cycles = {
      fast: 3,      // top content only
      medium: 6,    // normal cycle
      deep: 10,     // heavy SEO run (optional)
    };

    const mode = req.body?.mode || "fast";

    const limit = cycles[mode] || cycles.fast;

    /* ================= 2️⃣ TRIGGER AUTONOMOUS RUNNER ================= */
    try {
      const response = await fetch(`${baseUrl}/api/seo/autonomous-runner-v2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      await response.json();
    } catch (e) {
      console.log("Autonomous runner error:", e.message);
    }

    /* ================= 3️⃣ LIGHTWEIGHT SEO REFRESH ================= */
    try {
      await fetch(`${baseUrl}/api/seo/traffic-os`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          timestamp: Date.now(),
        }),
      });
    } catch (e) {
      console.log("Traffic OS cron error:", e.message);
    }

    /* ================= 4️⃣ ADSENSE SIGNAL REFRESH ================= */
    try {
      await fetch(`${baseUrl}/api/seo/boost-ads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          cron: true,
        }),
      });
    } catch (e) {
      console.log("Ads cron error:", e.message);
    }

    /* ================= 5️⃣ SELF EVOLUTION LOOP ================= */
    try {
      await fetch(`${baseUrl}/api/seo/self-evolving-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          trigger: "cron",
        }),
      });
    } catch (e) {
      console.log("Evolution cron error:", e.message);
    }

    /* ================= FINAL RESPONSE ================= */
    console.log("✅ SEO CRON CYCLE COMPLETED");

    return res.status(200).json({
      success: true,
      message: "SEO cron automation executed",
      mode,
      cycleLimit: limit,
    });

  } catch (e) {
    console.error("❌ SEO CRON ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
