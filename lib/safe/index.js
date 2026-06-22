/* ================= FALLBACK IMAGE ================= */

const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= SAFE TEXT ================= */

export function safeText(v) {
  if (v === null || v === undefined) {
    return "";
  }

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v
      .map((item) => safeText(item))
      .filter(Boolean)
      .join(" ");
  }

  if (typeof v === "object") {
    try {
      // Firebase Timestamp
      if (typeof v?.toDate === "function") {
        return v.toDate().toISOString();
      }

      if (typeof v?.text === "string") {
        return v.text;
      }

      if (typeof v?.title === "string") {
        return v.title;
      }

      if (typeof v?.name === "string") {
        return v.name;
      }

      if (typeof v?.value === "string") {
        return v.value;
      }

      return "";
    } catch {
      return "";
    }
  }

  return "";
}

/* ================= SAFE IMAGE ================= */

export function safeImage(v) {
  if (!v) {
    return FALLBACK_IMAGE;
  }

  if (typeof v === "string") {
    const img = v.trim();

    if (
      img &&
      (img.startsWith("https://") ||
        img.startsWith("http://"))
    ) {
      return img;
    }

    return FALLBACK_IMAGE;
  }

  if (typeof v === "object") {
    const candidate =
      v?.url ||
      v?.image ||
      v?.src ||
      "";

    if (
      typeof candidate === "string" &&
      (candidate.startsWith("https://") ||
        candidate.startsWith("http://"))
    ) {
      return candidate;
    }
  }

  return FALLBACK_IMAGE;
}

/* ================= SAFE NUMBER ================= */

export function safeNumber(v) {
  const n = Number(v);

  return Number.isFinite(n)
    ? n
    : 0;
}

/* ================= SAFE BOOLEAN ================= */

export function safeBoolean(v) {
  if (typeof v === "boolean") {
    return v;
  }

  if (typeof v === "number") {
    return v === 1;
  }

  if (typeof v === "string") {
    return v.toLowerCase() === "true";
  }

  return false;
}

/* ================= NORMALIZE PRODUCT ================= */

export function normalizeProduct(p = {}) {
  if (!p || typeof p !== "object") {
    return {
      id: "",
      title: "",
      description: "",
      image: FALLBACK_IMAGE,
      price: 0,
      category: "",
      rating: 0,
      views: 0,
      clicks: 0,
      orders: 0,
      viralBoost: false,
      link: "",
    };
  }

  return {
    id: safeText(p?.id),

    title: safeText(p?.title),
    description: safeText(p?.description),

    image: safeImage(p?.image),

    price: safeNumber(p?.price),

    category: safeText(p?.category),

    rating: safeNumber(p?.rating),

    views: safeNumber(p?.views),

    clicks: safeNumber(p?.clicks),

    orders: safeNumber(p?.orders),

    viralBoost: safeBoolean(p?.viralBoost),

    link: safeText(p?.link),
  };
}

/* ================= EXPORT DEFAULT ================= */

const safe = {
  safeText,
  safeImage,
  safeNumber,
  safeBoolean,
  normalizeProduct,
};

export default safe;
