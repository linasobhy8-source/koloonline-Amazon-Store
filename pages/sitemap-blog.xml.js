import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";

const baseUrl = "https://koloonline.online";

export default async function handler(req, res) {
  const snap = await getDocs(collection(db, "blog"));

  const urls = [];

  snap.forEach((doc) => {
    const data = doc.data();

    if (!data.slug) return;

    urls.push(`
      <url>
        <loc>${baseUrl}/blog/${data.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
      </url>
    `);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml);
}
