import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./dataFirewall";

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => {
      try {
        const data = doc.data();

        // 🚨 مهم: تنظيف كامل هنا
        const raw = {
          id: doc.id,
          ...data,
        };

        return normalizeProduct(raw);
      } catch (e) {
        return null;
      }
    });

    // 🚨 أقوى فلترة حماية
    return products.filter(
      (p) =>
        p &&
        typeof p === "object" &&
        typeof p.id === "string" &&
        typeof p.title === "string"
    );
  } catch (e) {
    console.error("Firebase error:", e);
    return [];
  }
}
