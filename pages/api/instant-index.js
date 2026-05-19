export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Missing URL" });
    }

    const baseUrl = "https://koloonline.online";
    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    /* ================= 1. GOOGLE SITEMAP PING ================= */
    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    );

    /* ================= 2. BING SITEMAP PING ================= */
    await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    );

    /* ================= 3. INDEXNOW (IMPORTANT FOR FAST INDEXING) ================= */
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: "koloonline.online",
        key: "koloonline-indexnow-key",
        urlList: [url],
      }),
    });

    /* ================= SUCCESS RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Indexing request sent successfully",
      url,
    });

  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
}
