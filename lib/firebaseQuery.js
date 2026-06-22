import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./safe";

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs
      .map((doc) => {
        const data = normalizeProduct({
          id: doc.id,
          ...doc.data(),
        });

        return data;
      })
      .filter(Boolean);

    return products;
  } catch (e) {
    console.error("Firebase error:", e);
    return [];
  }
}
