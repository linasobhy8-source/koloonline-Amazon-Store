import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= SAFE OBJECT ================= */
function safeObject(obj) {
  if (!obj || typeof obj !== "object") return {};

  const clean = {};

  for (const key in obj) {
    const value = obj[key];

    if (value === null || value === undefined) {
      clean[key] = "";
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      clean[key] = value;
    } else if (value?.toDate) {
      try {
        clean[key] = value.toDate().toISOString();
      } catch {
        clean[key] = "";
      }
    } else {
      clean[key] = value;
    }
  }

  return clean;
}

/* ================= GET PRODUCTS FAST ================= */
export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    return snap.docs.map((doc) =>
      safeObject({
        id: doc.id,
        ...doc.data(),
      })
    );
  } catch (error) {
    console.error("getProductsFast error:", error);
    return [];
  }
}
