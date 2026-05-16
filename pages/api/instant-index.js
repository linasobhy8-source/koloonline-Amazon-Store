export default async function handler(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Missing URL" });
    }

    // Google Indexing API endpoint (ping fallback)
    await fetch(`https://www.google.com/ping?sitemap=${url}`);

    // Bing ping (مهم جدًا)
    await fetch(`https://www.bing.com/ping?sitemap=${url}`);

    return res.status(200).json({
      success: true,
      message: "URL sent for indexing",
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
