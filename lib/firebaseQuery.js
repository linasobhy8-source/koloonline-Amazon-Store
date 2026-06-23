import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./normalizeProduct";

const forceText = (v) => {
  if (v == null) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.map(forceText).join(" ");

  if (typeof v === "object") {
    return (
      v?.text ||
      v?.title ||
      v?.name ||
      v?.value ||
      JSON.stringify(v) // 🔥 أهم fix
    );
  }

  return "";
};

const forceNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => {
      const normalized = normalizeProduct({
        id: doc.id,
        ...doc.data(),
      });

      return {
        id: String(doc.id || ""),
        title: forceText(normalized.title),
        description: forceText(normalized.description),
        category: forceText(normalized.category),

        image:
          typeof normalized.image === "string"
            ? normalized.image
            : "https://via.placeholder.com/300",

        price: forceNumber(normalized.price),
        rating: forceNumber(normalized.rating),
        views: forceNumber(normalized.views),
        clicks: forceNumber(normalized.clicks),
        orders: forceNumber(normalized.orders),

        viralBoost: Boolean(normalized.viralBoost),
      };
    });

    return products.filter((p) => p && p.id);
  } catch (e) {
    console.error("Firebase error:", e);
    return [];
  }
}
