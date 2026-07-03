import { generateSitemap } from "../../lib/sitemap-generator";

export default async function handler(req, res) {
  try {
    const xml = await generateSitemap();

    res.setHeader("Content-Type", "application/xml; charset=UTF-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap API Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to generate sitemap",
    });
  }
}
