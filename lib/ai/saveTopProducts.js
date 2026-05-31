import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= SAVE TOP PRODUCTS ================= */
export async function saveTopProducts(products) {
  try {
    const top = products
      .sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0))
      .slice(0, 10);

    const totalRevenueForecast = top.reduce(
      (sum, p) => sum + (p.revenueForecast || 0),
      0
    );

    await setDoc(doc(db, "analytics", "top_products"), {
      updatedAt: Date.now(),
      top,
      totalRevenueForecast,
    });

    return {
      success: true,
      top,
      totalRevenueForecast,
    };
  } catch (e) {
    console.error("saveTopProducts error:", e);
    return { success: false, error: e.message };
  }
}
