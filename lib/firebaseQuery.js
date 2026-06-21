import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./normalizeProduct";

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = [];

    snap.forEach((doc) => {
      try {
        const raw = doc.data() || {};

        const product = normalizeProduct({
          id: doc.id,
          ...raw,
        });

        if (product) {
          products.push(product);
        }
      } catch (err) {
        console.error("Normalize error:", doc.id, err);
      }
    });

    return products;
  } catch (e) {
    console.error("Firebase error:", e);
    return [];
  }
}
