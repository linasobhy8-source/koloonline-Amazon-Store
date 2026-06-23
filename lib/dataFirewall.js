const FALLBACK_IMG = "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= TEXT ================= */
export const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.map(safeText).join(" ");

  if (typeof v === "object") {
    try {
      return v.title || v.name || v.text || v.value || "";
    } catch {
      return "";
    }
  }

  return "";
};

/* ================= NUMBER ================= */
export const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= IMAGE ================= */
export const safeImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;

  if (v && typeof v === "object") {
    const img = v.url || v.image || v.src;
    if (typeof img === "string" && img.startsWith("http")) return img;
  }

  return FALLBACK_IMG;
};

/* ================= NORMALIZE PRODUCT ================= */
export const normalizeProduct = (p = {}) => {
  return {
    id: String(p.id || ""),
    title: safeText(p.title),
    image: safeImage(p.image),
    price: safeNumber(p.price),
    views: safeNumber(p.views),
    clicks: safeNumber(p.clicks),
    orders: safeNumber(p.orders),
    category: safeText(p.category),
  };
};
