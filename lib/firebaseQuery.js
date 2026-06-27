import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./dataFirewall";

/**
 * ================= FIREBASE FAST QUERY =================
 * - Safe
 * - Crash-proof
 * - Returns clean normalized products
 */
export async function getProductsFast() {
  try {
    if (!db) {
      console.error("Firebase DB not initialized");
      return [];
    }

    const snap = await getDocs(collection(db, "products"));

    if (!snap || snap.empty) {
      return [];
    }

    const products = snap.docs.map((doc) => {
      try {
        const data = doc.data();

        if (!data) return null;

        return normalizeProduct({
          id: doc.id,
          ...data,
        });
      } catch (err) {
        console.warn("Product normalize error:", err);
        return null;
      }
    });

    return products.filter(Boolean);
  } catch (e) {
    console.error("Firebase error:", e);
    return [];
  }
}
