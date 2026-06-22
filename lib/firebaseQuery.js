import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./normalizeProduct";

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs
      .map((doc) => {
        try {
          return normalizeProduct({
            id: doc.id,
            ...doc.data(),
          });
        } catch (err) {
          console.error("Normalize error:", doc.id, err);
          return null;
        }
      })
      .filter(Boolean);

    return products;
  } catch (e) {
    console.error("Firebase error:", e);
    return [];
  }
}
