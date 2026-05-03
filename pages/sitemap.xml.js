export default function Sitemap() {}

export async function getServerSideProps({ res }) {
  const baseUrl = "https://koloonline.online";

  const staticPages = [
    "",
    "/categories",
    "/search",
    "/dashboard"
  ];

  const urls = staticPages.map((page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
    </url>
  `);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("")}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

