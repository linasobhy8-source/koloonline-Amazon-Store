export default async function handler(req, res) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

    // ناخد البيانات من API الأساسي
    const apiRes = await fetch(`${baseUrl}/api/sitemap`);
    const data = await apiRes.json();

    const urls = data?.urls || data?.data || [];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${u.changefreq || "weekly"}</changefreq>
    <priority>${u.priority || 0.7}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return res.status(200).send(xml);
  } catch (e) {
    console.error("Sitemap XML error:", e);
    return res.status(500).send("Sitemap Error");
  }
}
