export async function getServerSideProps({ res }) {
  const baseUrl = "https://koloonline.online";

  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/blog`,
    `${baseUrl}/products`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
    <url>
      <loc>${url}</loc>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join("")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
