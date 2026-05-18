import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

function safeDate(date) {
  try {
    if (!date) return new Date().toISOString();
    if (typeof date === "number") return new Date(date).toISOString();
    if (date?.toDate) return date.toDate().toISOString();
    return new Date(date).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export async function getServerSideProps({ res }) {
  const baseUrl = "https://koloonline.online";

  const productSnap = await getDocs(collection(db, "products"));
  const blogSnap = await getDocs(collection(db, "blog"));

  const products = productSnap.docs.map(d => d.id);
  const blogs = blogSnap.docs.map(d => ({
    id: d.id,
    updatedAt: safeDate(d.data().updatedAt || d.data().createdAt),
  }));

  let urls = "";

  urls += `
<url><loc>${baseUrl}/</loc><priority>1.0</priority></url>
<url><loc>${baseUrl}/blog</loc><priority>0.9</priority></url>
<url><loc>${baseUrl}/products</loc><priority>0.9</priority></url>
`;

  products.forEach((id) => {
    urls += `<url><loc>${baseUrl}/product/${id}</loc><priority>0.8</priority></url>`;
  });

  blogs.forEach((b) => {
    urls += `<url><loc>${baseUrl}/blog/${b.id}</loc><lastmod>${b.updatedAt}</lastmod><priority>0.8</priority></url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
    }
