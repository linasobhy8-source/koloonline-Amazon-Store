import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./safe";

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = [];

    snap.docs.forEach((doc) => {
      const raw = {
        id: doc.id,
        ...doc.data(),
      };

      const safe = normalizeProduct(raw);

      // 🔥 حماية إضافية ضد أي object فاسد
      if (safe && typeof safe === "object") {
        products.push({
          id: String(safe.id || ""),
          title: String(safe.title || ""),
          description: String(safe.description || ""),
          image: String(safe.image || ""),
          price: Number(safe.price || 0),
          rating: Number(safe.rating || 0),
          views: Number(safe.views || 0),
          clicks: Number(safe.clicks || 0),
          orders: Number(safe.orders || 0),
          viralBoost: Boolean(safe.viralBoost),
        });
      }
    });

    return products;
  } catch (e) {
    console.error("Firebase error:", e);
    return [];
  }
}
