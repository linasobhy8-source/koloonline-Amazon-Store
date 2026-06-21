import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./safe";

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = [];

    snap.forEach((doc) => {
      const raw = doc.data();

      const product = normalizeProduct({
        id: doc.id,
        ...raw,
      });

      products.push(product);
    });

    return products;
  } catch (e) {
    console.error("Firebase error:", e);
    return [];
  }
}
