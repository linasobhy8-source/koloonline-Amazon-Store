import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";

export async function getServerSideProps({ res }) {
  try {
    const baseUrl = "https://koloonline.online";

    const snap = await getDocs(collection(db, "blog"));

    let urls = "";

    snap.forEach((doc) => {
      const data = doc.data();
      const slug = data?.slug || doc.id;

      urls += `
        <url>
          <loc>${baseUrl}/blog/${slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>
      `;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.write(xml);
    res.end();

    return { props: {} };
  } catch (e) {
    console.error(e);

    res.setHeader("Content-Type", "application/xml");
    res.write(`<?xml version="1.0"?><urlset></urlset>`);
    res.end();

    return { props: {} };
  }
}

export default function SitemapBlog() {
  return null;
}
