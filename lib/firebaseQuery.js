import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./normalizeProduct";

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

        // 🔥 HARD GUARD (منع أي object أو corrupted data)
        if (!normalized || typeof normalized !== "object") {
          return null;
        }

        return {
          id: String(normalized.id || ""),

          title: String(normalized.title || ""),
          description: String(normalized.description || ""),
          category: String(normalized.category || ""),

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

    // 🔥 FINAL CLEANUP (remove nulls + invalid objects)
    return products.filter((p) => {
      return (
        p &&
        typeof p === "object" &&
        typeof p.id === "string" &&
        p.id.trim().length > 0
      );
    });
  } catch (e) {
    console.error("Firebase getProductsFast error:", e);
    return [];
  }
}
