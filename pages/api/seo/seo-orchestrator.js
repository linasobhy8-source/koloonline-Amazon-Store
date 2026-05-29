export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }

    const { type, id, url } = req.body || {};

    if (!type || !id) {
      return res.status(400).json({
        success: false,
        error: "Missing type or id",
      });
    }

    const baseUrl = "https://koloonline.online";
    const targetUrl = url || `${baseUrl}/${type}/${id}`;

    console.log("🧠 SEO ORCHESTRATOR START:", targetUrl);

    /* ================= 1️⃣ SEO CORE BRAIN ================= */
    let brainResult = null;
    try {
      const resBrain = await fetch(`${baseUrl}/api/seo/v6-seo-brain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, url: targetUrl }),
      });

      brainResult = await resBrain.json();
    } catch (e) {
      console.log("Brain Error:", e.message);
    }

    /* ================= 2️⃣ TRAFFIC ENGINE ================= */
    try {
      await fetch(`${baseUrl}/api/seo/traffic-os`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, url: targetUrl, brain: brainResult }),
      });
    } catch (e) {
      console.log("Traffic OS Error:", e.message);
    }

    /* ================= 3️⃣ PREDICTIVE ENGINE ================= */
    try {
      await fetch(`${baseUrl}/api/seo/predictive-engine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, url: targetUrl }),
      });
    } catch (e) {
      console.log("Predictive Error:", e.message);
    }

    /* ================= 4️⃣ MONETIZATION ENGINE ================= */
    try {
      await fetch(`${baseUrl}/api/seo/revenue-os`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, url: targetUrl }),
      });
    } catch (e) {
      console.log("Revenue OS Error:", e.message);
    }

    /* ================= 5️⃣ ADS BOOST ================= */
    try {
      await fetch(`${baseUrl}/api/seo/boost-ads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, url: targetUrl }),
      });
    } catch (e) {
      console.log("Ads Boost Error:", e.message);
    }

    /* ================= 6️⃣ SELF EVOLUTION ================= */
    try {
      await fetch(`${baseUrl}/api/seo/self-evolving-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, url: targetUrl }),
      });
    } catch (e) {
      console.log("Self Evolution Error:", e.message);
    }

    /* ================= FINAL RESPONSE ================= */
    console.log("✅ SEO ORCHESTRATION COMPLETE:", targetUrl);

    return res.status(200).json({
      success: true,
      message: "SEO Orchestration completed",
      url: targetUrl,
      brain: brainResult || null,
    });

  } catch (e) {
    console.error("❌ ORCHESTRATOR ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
