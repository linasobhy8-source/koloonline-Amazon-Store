import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { safeText, safeNumber, safeImage } from "./safe";

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    return snap.docs.map((doc) => {
      const d = doc.data();

      return {
        id: doc.id,
        title: safeText(d.title),
        image: safeImage(d.image),
        price: safeNumber(d.price),
        category: safeText(d.category),
        views: safeNumber(d.views),
        clicks: safeNumber(d.clicks),
        orders: safeNumber(d.orders),
        viralBoost: Boolean(d.viralBoost),
      };
    });
  } catch (e) {
    console.error("Firebase error:", e);
    return [];
  }
}
