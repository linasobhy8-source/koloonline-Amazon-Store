import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";

export async function getServerSideProps({ res }) {
  const baseUrl = "https://koloonline.online";

  try {
    const snap = await getDocs(collection(db, "blog"));

    const urls = snap.docs
      .map((doc) => {
        const data = doc.data();

        const slug =
          typeof data?.slug === "string"
            ? data.slug
            : String(doc.id);

        return `
<url>
  <loc>${baseUrl}/blog/${slug}</loc>
  <changefreq>weekly</changefreq>
  <priority>0.6</priority>
</url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.end(xml);

    return { props: {} };
  } catch (e) {
    res.setHeader("Content-Type", "application/xml");
    res.end(`<?xml version="1.0"?><urlset></urlset>`);
    return { props: {} };
  }
}

export default function SitemapBlog() {
  return null;
}
