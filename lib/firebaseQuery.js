import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { normalizeProduct } from "./normalizeProduct";

/* ================= SAFE TEXT ================= */
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

/* ================= SAFE NUMBER ================= */
const forceNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= MAIN FETCH ================= */
export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs
      .map((doc) => {
        try {
          const data = doc.data();

          const normalized = normalizeProduct({
            id: doc.id,
            ...data,
          });

          if (!normalized || typeof normalized !== "object") return null;

          return {
            id: String(doc.id),

            // 🔥 FORCE PRIMITIVES ONLY (critical fix)
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
            trending: Boolean(normalized.trending || false),
          };
        } catch (e) {
          console.error("Normalize error:", doc.id, e);
          return null;
        }
      })
      .filter(Boolean);

    return products;
  } catch (e) {
    console.error("Firebase getProductsFast error:", e);
    return [];
  }
}
