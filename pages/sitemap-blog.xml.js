import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    res.end(xml);

    return { props: {} };
  } catch (e) {
    console.error(e);

    res.setHeader("Content-Type", "application/xml");
    res.end(`<?xml version="1.0"?><urlset></urlset>`);

    return { props: {} };
  }
}

export default function SitemapBlog() {
  return null;
}
