import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const baseUrl = "https://koloonline.online";

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let urls = "";

    snap.forEach((doc) => {
      const id = doc.id;

      urls += `
<url>
  <loc>${baseUrl}/product/${id}</loc>
  <changefreq>daily</changefreq>
  <priority>0.7</priority>
</url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (e) {
    console.error("SITEMAP ERROR:", e);
    res.status(500).send("error");
  }
}
