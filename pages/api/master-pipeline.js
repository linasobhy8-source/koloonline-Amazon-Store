export default async function handler(req, res) {
  try {
    const { type, id, url } = req.body || {};

    if (!type || !id) {
      return res.status(400).json({
        success: false,
        error: "Missing type or id",
      });
    }

    const baseUrl = "https://koloonline.online";
    const targetUrl = url || `${baseUrl}/${type}/${id}`;

    console.log("🚀 Pipeline Started:", targetUrl);

    /* ================= 1️⃣ AUTO INDEX ================= */
    try {
      await fetch(`${baseUrl}/api/indexnow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: targetUrl }),
      });
    } catch (e) {
      console.log("Index Error:", e.message);
    }

    /* ================= 2️⃣ UPDATE SITEMAP ================= */
    try {
      await fetch(`${baseUrl}/api/sitemap`, {
        method: "POST",
      });
    } catch (e) {
      console.log("Sitemap Error:", e.message);
    }

    /* ================= 3️⃣ GOOGLE + BING PING ================= */
    try {
      await fetch(`${baseUrl}/api/ping-google`, {
        method: "POST",
      });
    } catch (e) {
      console.log("Google Ping Error:", e.message);
    }

    /* ================= 4️⃣ SOCIAL HOOK ================= */
    try {
      await fetch(`${baseUrl}/api/social-hook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: targetUrl,
          type,
        }),
      });
    } catch (e) {
      console.log("Social Hook Error:", e.message);
    }

    /* ================= 5️⃣ LOGGING ================= */
    try {
      await fetch(`${baseUrl}/api/cron-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "master_pipeline",
          status: "success",
          target: targetUrl,
          source: `${type}/${id}`,
          createdAt: new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.log("Log Error:", e.message);
    }

    /* ================= 6️⃣ SEO BOOST ================= */
    try {
      if (type === "blog") {
        await fetch(`${baseUrl}/api/seo/boost-blog`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, url: targetUrl }),
        });
      }

      if (type === "product") {
        await fetch(`${baseUrl}/api/seo/boost-product`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, url: targetUrl }),
        });
      }
    } catch (e) {
      console.log("SEO Boost Error:", e.message);
    }

    /* ================= 7️⃣ ADSENSE BOOST SIGNAL ================= */
    try {
      await fetch(`${baseUrl}/api/seo/boost-ads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          id,
          url: targetUrl,
        }),
      });
    } catch (e) {
      console.log("Ads Boost Error:", e.message);
    }

    /* ================= FINAL RESPONSE ================= */
    console.log("✅ PIPELINE DONE:", targetUrl);

    return res.status(200).json({
      success: true,
      message: "Pipeline executed successfully",
      url: targetUrl,
    });

  } catch (e) {
    console.error("❌ MASTER PIPELINE ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
