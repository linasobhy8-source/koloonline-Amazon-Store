export async function getServerSideProps({ res }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

  try {
    const response = await fetch(`${baseUrl}/api/sitemap`);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const xml = await response.text();

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=UTF-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    res.write(xml);
    res.end();
  } catch (err) {
    console.error("Sitemap Error:", err);

    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("Sitemap Error");
  }

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
