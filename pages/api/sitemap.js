export default function handler(req, res) {
  console.log("========== SITEMAP TEST ==========");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("==================================");

  return res.status(200).json({
    success: true,
    file: "pages/api/sitemap.js",
    method: req.method,
    url: req.url,
    message: "✅ This request reached pages/api/sitemap.js",
    timestamp: new Date().toISOString(),
  });
}
