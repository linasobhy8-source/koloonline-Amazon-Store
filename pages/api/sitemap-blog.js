import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

const baseUrl = "https://koloonline.online";

function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrl(loc) {
  return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
}

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "blog"));

    const urls = [];

    snap.forEach((doc) => {
      const data = doc.data();

      const slug = data?.slug || doc.id;

      if (!slug) return;

      urls.push(
        buildUrl(`${baseUrl}/blog/${slug}`)
      );
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    res.setHeader(
      "Content-Type",
      "application/xml"
    );

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap Error:", error);

    return res.status(500).send(`
      <?xml version="1.0" encoding="UTF-8"?>
      <error>Sitemap generation failed</error>
    `);
  }
}
