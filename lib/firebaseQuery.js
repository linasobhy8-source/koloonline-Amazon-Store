import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { deepSanitize } from "./deepSanitizer";

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    return snap.docs
      .map((doc) => {
        const data = doc.data();

        return deepSanitize({
          id: doc.id,
          ...data,
        });
      })
      .filter(Boolean);
  } catch (e) {
    console.error(e);
    return [];
  }
}
