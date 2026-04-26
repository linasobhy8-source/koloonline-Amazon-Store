import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {

  const baseUrl = "https://koloonline.online";

  const snap = await getDocs(collection(db, "products"));

  const products = snap.docs.map(doc => doc.data());

  let urls = `
    <url>
      <loc>${baseUrl}</loc>
      <priority>1.0</priority>
    </url>
  `;

  products.forEach(p => {
    urls += `
      <url>
        <loc>${baseUrl}/product?asin=${p.asin}</loc>
        <priority>0.9</priority>
      </url>
    `;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
}
