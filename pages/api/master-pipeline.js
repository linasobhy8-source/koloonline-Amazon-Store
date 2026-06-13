export default async function handler(req, res) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://koloonline.online";

  const seoDescription =
    "Discover trending Amazon products, in-depth reviews, and smart shopping guides. Updated daily with high-quality deals and buying insights.";

  try {
    const { type, id, url } = req.body || {};

    if (!type || !id) {
      return res.status(400).json({
        success: false,
        error: "Missing type or id",
      });
    }

    const targetUrl =
      url || `${baseUrl}/${type}/${id}`;

    console.log("🚀 PIPELINE START:", targetUrl);

    /* ================= 1️⃣ FAST INDEXNOW ================= */
    const indexNowPromise = fetch(
      `${baseUrl}/api/indexnow`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: "koloonline.online",
          key: process.env.INDEXNOW_KEY,
          urlList: [targetUrl],
        }),
      }
    ).catch((e) =>
      console.log("IndexNow Error:", e.message)
    );

    /* ================= 2️⃣ SOCIAL HOOK ================= */
    const socialPromise = fetch(
      `${baseUrl}/api/social-hook`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: targetUrl,
          type,
        }),
      }
    ).catch((e) =>
      console.log("Social Hook Error:", e.message)
    );

    /* ================= 3️⃣ LOGGING ================= */
    const logPromise = fetch(
      `${baseUrl}/api/cron-logs`,
      {
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
      }
    ).catch((e) =>
      console.log("Log Error:", e.message)
    );

    /* ================= 4️⃣ SEO BOOST ================= */
    const seoBoostPromise = (async () => {
      try {
        if (type === "blog") {
          await fetch(
            `${baseUrl}/api/seo/boost-blog`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id,
                url: targetUrl,
              }),
            }
          );
        }

        if (type === "product") {
          await fetch(
            `${baseUrl}/api/seo/boost-product`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id,
                url: targetUrl,
              }),
            }
          );
        }
      } catch (e) {
        console.log(
          "SEO Boost Error:",
          e.message
        );
      }
    })();

    /* ================= 5️⃣ ADS SIGNAL ================= */
    const adsPromise = fetch(
      `${baseUrl}/api/seo/boost-ads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          id,
          url: targetUrl,
        }),
      }
    ).catch((e) =>
      console.log("Ads Boost Error:", e.message)
    );

    /* ================= 6️⃣ RUN ALL IN PARALLEL ================= */
    await Promise.allSettled([
      indexNowPromise,
      socialPromise,
      logPromise,
      seoBoostPromise,
      adsPromise,
    ]);

    console.log("✅ PIPELINE DONE:", targetUrl);

    return res.status(200).json({
      success: true,
      message: "Pipeline executed successfully",
      url: targetUrl,

      seoDescription,
      seoHint:
        "High-quality content optimized for search intent, affiliate transparency, and user engagement.",
    });
  } catch (e) {
    console.error("❌ PIPELINE ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
