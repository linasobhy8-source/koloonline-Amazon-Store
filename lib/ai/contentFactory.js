import { setDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

export async function contentFactory(products) {
  const pages = products.map(p => ({
    slug: `/product/${p.id}`,
    title: `Buy ${p.title} - Best Price`,
    seo: `Best deal for ${p.title} with fast shipping`,
  }));

  for (const page of pages) {
    await setDoc(doc(db, "seo_pages", page.slug), page);
  }

  console.log("📝 SEO PAGES CREATED:", pages.length);

  return {
    seoPages: pages.length,
  };
}
