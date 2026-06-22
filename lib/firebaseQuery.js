import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./safe";

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    return snap.docs
      .map((doc) => {
        try {
          return normalizeProduct({
            id: doc.id,
            ...doc.data(),
          });
        } catch (e) {
          return null;
        }
      })
      .filter((p) => p && typeof p === "object");
  } catch (e) {
    console.error("Firebase error:", e);
    return [];
  }
}
