/* ================= FALLBACK ================= */

const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= SAFE TEXT ================= */

export const safeText = (v) => {
  if (v == null) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v.map(safeText).filter(Boolean).join(" ");
  }

  if (typeof v === "object") {
    try {
      if (typeof v.toDate === "function") {
        return v.toDate().toISOString();
      }
    } catch {}

    if (typeof v.text === "string") return v.text;
    if (typeof v.title === "string") return v.title;
    if (typeof v.name === "string") return v.name;
    if (typeof v.value === "string") return v.value;

    return "";
  }

  return "";
};

/* ================= SAFE IMAGE ================= */

export const safeImage = (v) => {
  if (typeof v === "string") {
    return v.startsWith("http") ? v : FALLBACK_IMAGE;
  }

  if (typeof v === "object" && v !== null) {
    const img = v.url || v.image || v.src;

    if (typeof img === "string" && img.startsWith("http")) {
      return img;
    }
  }

  return FALLBACK_IMAGE;
};

/* ================= SAFE NUMBER ================= */

export const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= SAFE BOOLEAN ================= */

export const safeBoolean = (v) => {
  return v === true || v === 1 || v === "true";
};

/* ================= MAIN NORMALIZER ================= */

export const normalizeProduct = (raw = {}) => {
  if (!raw || typeof raw !== "object") {
    return {
      id: "",
      title: "",
      description: "",
      category: "",
      image: FALLBACK_IMAGE,
      price: 0,
      rating: 0,
      views: 0,
      clicks: 0,
      orders: 0,
      viralBoost: false,
    };
  }

  return {
    id: String(raw.id || ""),

    title: safeText(raw.title),
    description: safeText(raw.description),
    category: safeText(raw.category),

    image: safeImage(raw.image),

    price: safeNumber(raw.price),
    rating: safeNumber(raw.rating),
    views: safeNumber(raw.views),
    clicks: safeNumber(raw.clicks),
    orders: safeNumber(raw.orders),

    viralBoost: safeBoolean(raw.viralBoost),
  };
};
