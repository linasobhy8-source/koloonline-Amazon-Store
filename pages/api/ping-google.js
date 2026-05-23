export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";
    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    /* ================= GOOGLE PING ================= */
    const googlePing = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    );

    /* ================= INDEXNOW ================= */
    const indexNowKey = "koloonline-indexnow-key-2026";

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

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      google: googlePing.status,
      indexNow: indexNowResult,
      message: "SEO ping completed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
