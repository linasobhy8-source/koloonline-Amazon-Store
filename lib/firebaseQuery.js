import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./normalizeProduct"; // 🔥 مهم تأكد المسار صح

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => {
      try {
        const data = doc.data();

        const normalized = normalizeProduct({
          id: doc.id,
          ...data,
        });

        // 🔥 HARD SAFETY CHECK (يمنع React #130 لاحقًا)
        if (!normalized || typeof normalized !== "object") {
          return null;
        }

        return {
          id: String(normalized.id || ""),
          title: String(normalized.title || ""),
          description: String(normalized.description || ""),
          image: String(normalized.image || ""),
          price: Number(normalized.price || 0),
          rating: Number(normalized.rating || 0),
          views: Number(normalized.views || 0),
          clicks: Number(normalized.clicks || 0),
          orders: Number(normalized.orders || 0),
          viralBoost: Boolean(normalized.viralBoost),
        };
      } catch (e) {
        console.error("Normalize error:", doc.id, e);
        return null;
      }
    });

    // 🔥 remove nulls + broken objects
    return products.filter(
      (p) =>
        p &&
        typeof p === "object" &&
        typeof p.id === "string" &&
        p.id.length > 0
    );
  } catch (e) {
    console.error("Firebase getProductsFast error:", e);
    return [];
  }
}
