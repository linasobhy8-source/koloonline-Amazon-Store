import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= SAFE VALUE ================= */
function safeValue(value) {
  if (value === null || value === undefined) return "";

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (value?.toDate && typeof value.toDate === "function") {
    try {
      return value.toDate().toISOString();
    } catch {
      return "";
    }
  }

  if (Array.isArray(value)) {
    return value.map((v) => safeValue(v));
  }

  if (typeof value === "object") {
    const obj = {};
    for (const k in value) {
      obj[k] = safeValue(value[k]);
    }
    return obj;
  }

  return "";
}

/* ================= SAFE OBJECT ================= */
function safeObject(obj) {
  if (!obj || typeof obj !== "object") return {};

  const clean = {};

  for (const key in obj) {
    clean[key] = safeValue(obj[key]);
  }

  return clean;
}

/* ================= FAST FETCH ================= */
export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    if (!snap || snap.empty) return [];

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
