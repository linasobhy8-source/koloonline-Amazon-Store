const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= CORE SAFE TEXT ================= */
export const safeText = (v) => {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (!v) return "";

  if (typeof v === "object") {
    try {
      return (
        v.title ||
        v.name ||
        v.text ||
        v.value ||
        JSON.stringify(v) ||
        ""
      );
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
  if (typeof v === "string" && v.startsWith("http")) return v;

  if (v && typeof v === "object") {
    const img = v.url || v.image || v.src || v.value;

    if (typeof img === "string" && img.startsWith("http")) {
      return img;
    }
  }

  return FALLBACK_IMAGE;
};

/* ================= OBJECT KILLER (🔥 أهم جزء) ================= */
export const sanitizeObject = (obj = {}) => {
  if (!obj || typeof obj !== "object") return {};

  const clean = {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "object" && value !== null) {
      clean[key] =
        key === "image" ? safeImage(value) : safeText(value);
    } else if (typeof value === "number") {
      clean[key] = safeNumber(value);
    } else {
      clean[key] = safeText(value);
    }
  }

  return clean;
};

/* ================= PRODUCT FIREWALL ================= */
export const normalizeProduct = (raw = {}) => {
  const safe = sanitizeObject(raw);

  return {
    id: String(raw.id || ""),

    title: safeText(safe.title),
    description: safeText(safe.description),
    category: safeText(safe.category),

    image: safeImage(safe.image),

    price: safeNumber(safe.price),
    rating: safeNumber(safe.rating),
    views: safeNumber(safe.views),
    clicks: safeNumber(safe.clicks),
    orders: safeNumber(safe.orders),

    viralBoost: Boolean(safe.viralBoost),
  };
};
