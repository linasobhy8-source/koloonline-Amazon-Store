export default function handler(req, res) {

  const baseUrl = "https://www.koloonline.online";

  const pages = [
    "/",
    "/index.html",
    "/cart.html",
    "/checkout.html",
    "/thankyou.html",
    "/about.html",
    "/contact.html",
    "/blog.html"
  ];

  const urls = pages.map(page => {
    return `
<url>
  <loc>${baseUrl}${page}</loc>
  <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();
}
