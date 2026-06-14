import { topPages } from "../data/topPages";

const baseUrl = "https://koloonline.online";

function url(loc) {
  return `
  <url>
    <loc>${loc}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
}

export default function handler(req, res) {
  const urls = [];

  urls.push(url(`${baseUrl}/`));
  urls.push(url(`${baseUrl}/products`));
  urls.push(url(`${baseUrl}/blog`));

  topPages.forEach((p) => {
    urls.push(url(`${baseUrl}/top/${p.slug}`));
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml);
}
