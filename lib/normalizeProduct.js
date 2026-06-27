const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= SAFE TEXT ================= */
export const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.map(safeText).join(" ");

  if (typeof v === "object") {
    return (
      v.title ||
      v.name ||
      v.text ||
      v.value ||
      ""
    );
  }

  return "";
};

/* ================= SAFE NUMBER ================= */
export const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= SAFE IMAGE ================= */
export const safeImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;
  return FALLBACK_IMAGE;
};

/* ================= NORMALIZE ================= */
export const normalizeProduct = (raw = {}) => {
  return {
    id: safeText(raw.id),
    title: safeText(raw.title),
    image: safeImage(raw.image),
    price: safeNumber(raw.price),
    rating: safeNumber(raw.rating),
    views: safeNumber(raw.views),
    clicks: safeNumber(raw.clicks),
  };
};
