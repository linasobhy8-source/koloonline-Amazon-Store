import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./normalizeProduct";

const forceText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.map(forceText).join(" ");

  if (typeof v === "object") {
    return v.text || v.title || v.name || v.value || "";
  }

  return "";
};

const forceNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const forceImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;

  if (typeof v === "object" && v !== null) {
    const img = v.url || v.image || v.src;
    if (typeof img === "string" && img.startsWith("http")) return img;
  }

  return "https://via.placeholder.com/300x300?text=Koloonline";
};

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => {
      const raw = doc.data();
      const n = normalizeProduct({ id: doc.id, ...raw });

      return {
        id: String(doc.id || ""),
        title: forceText(n.title),
        description: forceText(n.description),
        category: forceText(n.category),
        image: forceImage(n.image),
        price: forceNumber(n.price),
        rating: forceNumber(n.rating),
        views: forceNumber(n.views),
        clicks: forceNumber(n.clicks),
        orders: forceNumber(n.orders),
        viralBoost: Boolean(n.viralBoost),
      };
    });

    return products.filter((p) => p.id);
  } catch (e) {
    console.error("Firebase error:", e);
    return [];
  }
}
