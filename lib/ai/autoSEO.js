import { setDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= AUTO SEO GENERATOR ================= */
export async function generateSEO(product) {
  const slug = product.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const seo = {
    title: `${product.title} | Best Price & Review`,
    description: `Buy ${product.title} at best price. Trending now.`,
    keywords: [
      product.title,
      "best deal",
      "buy online",
      "amazon product",
    ],
    slug
  };

  await setDoc(doc(db, "seo", product.id), seo);

  return seo;
}
