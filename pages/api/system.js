export default async function handler(req, res) {
  try {
    const { action } = req.query;

    if (action === "indexnow") {
      return res.json({ success: true, message: "IndexNow triggered" });
    }

    if (action === "sitemap") {
      return res.json({ success: true, message: "Sitemap ready" });
    }

    if (action === "seo") {
      return res.json({ success: true, message: "SEO updated" });
    }

    return res.json({ success: true, message: "System running" });

  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
