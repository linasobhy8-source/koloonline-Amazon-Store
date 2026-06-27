const FALLBACK_IMG =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= SAFE TEXT ================= */
export const safeText = (v) => {
  if (v == null) return "";

  if (typeof v === "string") return v.trim();

  if (typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (typeof v === "object") {
    try {
      return v.title || v.name || v.text || v.value || "";
    } catch {
      return "";
    }
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
  if (typeof v === "string" && v.startsWith("http")) {
    return v.trim();
  }

  if (v && typeof v === "object") {
    const img = v.url || v.image || v.src || v.value;

    if (typeof img === "string" && img.startsWith("http")) {
      return img.trim();
    }
  }

  return FALLBACK_IMG;
};

/* ================= SAFE BOOLEAN ================= */
export const safeBoolean = (v) => {
  return v === true || v === "true" || v === 1;
};

/* ================= SAFE ARRAY ================= */
export const safeArray = (v) => {
  return Array.isArray(v) ? v.filter(Boolean) : [];
};

/* ================= NORMALIZE PRODUCT ================= */
export const normalizeProduct = (p = {}) => {
  if (!p || typeof p !== "object") {
    return {
      id: "",
      title: "",
      image: FALLBACK_IMG,
      price: 0,
      views: 0,
      clicks: 0,
      orders: 0,
      category: "",
      description: "",
    };
  }

  return {
    id: String(p.id || ""),
    title: safeText(p.title),
    image: safeImage(p.image),
    price: safeNumber(p.price),

    views: safeNumber(p.views),
    clicks: safeNumber(p.clicks),
    orders: safeNumber(p.orders),

    category: safeText(p.category),
    description: safeText(p.description),

    viralBoost: safeBoolean(p.viralBoost),
  };
};

export default normalizeProduct;
