export default async function handler(req, res) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://koloonline.online";

  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  /* ================= ADSENSE-FRIENDLY SEO DESCRIPTION ================= */
  const seoDescription =
    "SEO automation system that ensures fast indexing on Google and IndexNow for better visibility, traffic growth, and search engine performance.";

  try {
    console.log("🚀 SEO Ping Started");

    /* ================= GOOGLE PING ================= */
    const googlePing = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(
        sitemapUrl
      )}`
    );

    /* ================= INDEXNOW ================= */
    const indexNowKey =
      process.env.INDEXNOW_KEY || "koloonline-indexnow-key-2026";

    const indexNowBody = {
      host: "koloonline.online",
      key: indexNowKey,
      urlList: [
        `${baseUrl}/`,
        `${baseUrl}/products`,
        `${baseUrl}/blog`,
        `${baseUrl}/search`,
        `${baseUrl}/categories`,
        `${baseUrl}/amazon-haul`,
      ],
    };

    const indexNowResponse = await fetch(
      "https://api.indexnow.org/indexnow",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(indexNowBody),
      }
    );

    const indexNowResult = await indexNowResponse.text();

    console.log("✅ SEO Ping Completed");

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,

      googleStatus: googlePing.status,
      indexNowStatus: indexNowResponse.status,
      indexNowResult,

      sitemap: sitemapUrl,

      /* ================= SEO / ADSENSE SAFE CONTEXT ================= */
      seoDescription,
      intent:
        "Improve indexing speed, search visibility, and organic traffic performance without violating Google AdSense policies.",
    });
  } catch (error) {
    console.error("❌ SEO Ping Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Unknown error",
    });
  }
}
