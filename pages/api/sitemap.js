import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";
    const now = new Date().toISOString();

    const snap = await getDocs(collection(db, "products"));
    const products = snap.docs.map((doc) => doc.data());

    let urls = `
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${now}</lastmod>
        <priority>1.0</priority>
      </url>

      <url>
        <loc>${baseUrl}/blog</loc>
        <lastmod>${now}</lastmod>
        <priority>0.8</priority>
      </url>

      <url>
        <loc>${baseUrl}/contact</loc>
        <lastmod>${now}</lastmod>
        <priority>0.7</priority>
      </url>
    `;

    products.forEach((p) => {
      if (!p?.asin) return;

      urls += `
        <url>
          <loc>${baseUrl}/product/${p.asin}</loc>
          <lastmod>${now}</lastmod>
          <priority>0.9</priority>
        </url>
      `;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemap);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating sitemap");
  }
}
