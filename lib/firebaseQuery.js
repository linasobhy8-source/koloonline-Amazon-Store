import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

import {
  safeText,
  safeImage,
  safeNumber,
} from "./safe";

/* ================= GET PRODUCTS FAST ================= */

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => {
      const data = doc.data() || {};

      try {
        return {
          id: doc.id,

          title: safeText(data.title),
          description: safeText(data.description),

          image: safeImage(data.image),

          price: safeNumber(data.price),

          category: safeText(data.category),

          rating: safeNumber(data.rating),
          views: safeNumber(data.views),
          clicks: safeNumber(data.clicks),
          orders: safeNumber(data.orders),

          viralBoost: Boolean(data.viralBoost),
        };
      } catch (err) {
        console.error("Normalize error:", doc.id, err);
        return null;
      }
    });

    return products.filter(Boolean);
  } catch (e) {
    console.error("Firebase getProductsFast error:", e);
    return [];
  }
          }
