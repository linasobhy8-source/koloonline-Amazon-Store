import { setDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= CONTENT FACTORY (LEVEL 14) ================= */

export async function contentFactory(products = []) {
  try {
    if (!products.length) {
      console.log("⚠️ No products received for content factory");
      return { seoPages: 0 };
    }

    const pages = products.map((p) => {
      const slug = `/product/${p.id}`;

      return {
        id: p.id,
        slug,
        title: `Buy ${p.title} - Best Price & Fast Shipping`,
        seo: `Best deal for ${p.title} | Limited offer | High demand product`,
        createdAt: Date.now(),
        score:
          (p.views || 0) * 0.2 +
          (p.clicks || 0) * 1.2 +
          (p.orders || 0) * 5 +
          (p.viralBoost ? 50 : 0),
      };
    });

    /* ================= SAVE TO FIRESTORE ================= */
    for (const page of pages) {
      await setDoc(doc(db, "seo_pages", page.id), page);
    }

    console.log("🧠 LEVEL 14 CONTENT FACTORY DONE:", pages.length);

    return {
      success: true,
      seoPages: pages.length,
      topPages: pages.slice(0, 5),
    };

  } catch (error) {
    console.error("❌ contentFactory error:", error.message);

    return {
      success: false,
      seoPages: 0,
      error: error.message,
    };
  }
}
