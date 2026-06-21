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
    return v
      .map(safeText)
      .filter(Boolean)
      .join(" ");
  }

  if (typeof v === "object") {
    try {
      if (typeof v.toDate === "function") {
        return v.toDate().toISOString();
      }

      if (typeof v.text === "string") return v.text;
      if (typeof v.title === "string") return v.title;
      if (typeof v.value === "string") return v.value;
      if (typeof v.name === "string") return v.name;

      return "";
    } catch {
      return "";
    }
  }

  return "";
};

/* ================= SAFE IMAGE ================= */

export const safeImage = (v) => {
  if (!v) return FALLBACK_IMAGE;

  if (typeof v === "string") {
    return v.startsWith("http") ? v : FALLBACK_IMAGE;
  }

  if (typeof v === "object") {
    const candidate =
      v?.url ||
      v?.image ||
      v?.src ||
      "";

    if (
      typeof candidate === "string" &&
      candidate.startsWith("http")
    ) {
      return candidate;
    }
  }

  return FALLBACK_IMAGE;
};

/* ================= SAFE NUMBER ================= */

export const safeNumber = (v) => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;

  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= SAFE BOOLEAN ================= */

export const safeBoolean = (v) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return false;
};

/* ================= SAFE OBJECT (GLOBAL PROTECTION) ================= */

export const safeObject = (obj = {}) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
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
    id: safeText(obj.id),

    title: safeText(obj.title),
    description: safeText(obj.description),
    category: safeText(obj.category),

    image: safeImage(obj.image),

    price: safeNumber(obj.price),
    rating: safeNumber(obj.rating),
    views: safeNumber(obj.views),
    clicks: safeNumber(obj.clicks),
    orders: safeNumber(obj.orders),

    viralBoost: safeBoolean(obj.viralBoost),
  };
};
