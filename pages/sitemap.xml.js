import { generateSitemap } from "../lib/sitemap-generator";

export async function getServerSideProps({ res }) {
  const xml = await generateSitemap();

  res.setHeader("Content-Type", "application/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );

  res.write(xml);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
