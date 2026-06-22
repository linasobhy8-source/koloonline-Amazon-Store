import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./normalizeProduct";

const forceText = (v) => {
  if (v == null) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) {
    return v.map(forceText).join(" ");
  }

  if (typeof v === "object") {
    return v?.text || v?.title || v?.name || v?.value || "";
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
      try {
        const data = doc.data();

        const normalized = normalizeProduct({
          id: doc.id,
          ...data,
        });

        if (!normalized || typeof normalized !== "object") return null;

        return {
          id: String(doc.id || ""),

          // 🔥 أهم إصلاح هنا (منع object نهائيًا)
          title: forceText(normalized.title),
          description: forceText(normalized.description),
          category: forceText(normalized.category),

          image:
            typeof normalized.image === "string"
              ? normalized.image
              : "",

          price: forceNumber(normalized.price),
          rating: forceNumber(normalized.rating),
          views: forceNumber(normalized.views),
          clicks: forceNumber(normalized.clicks),
          orders: forceNumber(normalized.orders),

          viralBoost: Boolean(normalized.viralBoost),
        };
      } catch (e) {
        console.error("Normalize error:", doc.id, e);
        return null;
      }
    });

    return products.filter(
      (p) =>
        p &&
        typeof p === "object" &&
        typeof p.id === "string" &&
        p.id.length > 0
    );
  } catch (e) {
    console.error("Firebase getProductsFast error:", e);
    return [];
  }
      }
