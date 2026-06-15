import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= SAVE TOP PRODUCTS ================= */
export async function saveTopProducts(products = []) {
  try {
    if (!Array.isArray(products)) return { success: false, error: "Invalid products" };

    const top = [...products]
      .map((p) => ({
        ...p,
        trendScore: Number(p?.trendScore) || 0,
        revenueForecast: Number(p?.revenueForecast) || 0,
      }))
      .sort((a, b) => b.trendScore - a.trendScore)
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
    return {
      success: false,
      error: e?.message || "Unknown error",
    };
  }
}
