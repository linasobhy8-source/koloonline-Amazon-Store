export default async function handler(req, res) {
  try {
    const baseUrl = "https://www.koloonline.online";

    // نجيب البيانات من API الداخلي
    const response = await fetch(`${baseUrl}/api/sitemap-data`);
    const data = await response.json();

    const urls = data.urls || [];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || ""}</lastmod>
    <changefreq>${u.changefreq || "weekly"}</changefreq>
    <priority>${u.priority || 0.8}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, s-maxage=3600");

    return res.status(200).send(xml);
  } catch (e) {
    return res.status(500).send("sitemap error");
  }
}
