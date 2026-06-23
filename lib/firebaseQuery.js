import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./dataFirewall";

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

        return normalized;
      } catch (e) {
        return null;
      }
    });

    return products.filter(Boolean);
  } catch (e) {
    console.error("Firebase error:", e);
    return [];
  }
}
