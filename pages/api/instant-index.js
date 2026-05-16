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

    /* ================= 1. GOOGLE (SITEMAP PING ONLY) ================= */
    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(
        baseUrl + "/sitemap.xml"
      )}`
    );

    /* ================= 2. BING ================= */
    await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(
        baseUrl + "/sitemap.xml"
      )}`
    );

    /* ================= 3. INDEXNOW (REAL BOOST) ================= */
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

    /* ================= SUCCESS ================= */
    return res.status(200).json({
      success: true,
      message: "Index request sent successfully",
    });

  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
}
