export async function getServerSideProps({ res }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

  try {
    const apiRes = await fetch(`${baseUrl}/api/sitemap`);
    const xml = await apiRes.text();

    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    res.write(xml);
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end("Sitemap error");
  }

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
