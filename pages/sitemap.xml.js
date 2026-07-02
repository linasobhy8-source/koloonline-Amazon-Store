export default async function handler(req, res) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

    // نجيب السايت ماب من الـ API الداخلي
    const response = await fetch(`${baseUrl}/api/sitemap`);

    const data = await response.text();

    // مهم جدًا: نرجع XML زي ما هو
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");

    return res.status(200).send(data);
  } catch (error) {
    console.error("Sitemap proxy error:", error);

    return res.status(200).send(`<?xml version="1.0"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://koloonline.online</loc>
  </url>
</urlset>`);
  }
}
