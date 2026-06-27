import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { deepSanitizeProduct } from "./strictSafe";

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    return snap.docs
      .map((doc) => {
        try {
          return deepSanitizeProduct({
            id: doc.id,
            ...doc.data(),
          });
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch (e) {
    console.error(e);
    return [];
  }
}
