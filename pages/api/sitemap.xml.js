export async function getServerSideProps({ res }) {
  const baseUrl = "https://koloonline.online";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap-products.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
  </sitemap>

</sitemapindex>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(xml);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
