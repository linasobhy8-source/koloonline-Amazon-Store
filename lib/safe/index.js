const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= TEXT ================= */
export function safeText(v) {
  if (v === null || v === undefined) return "";

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
    // Firebase Timestamp
    if (typeof v.toDate === "function") {
      try {
        return v.toDate().toISOString();
      } catch {
        return "";
      }
    }

    return (
      v?.text ||
      v?.title ||
      v?.name ||
      v?.value ||
      ""
    );
  }

  return "";
}

/* ================= IMAGE ================= */
export function safeImage(v) {
  if (!v) return FALLBACK_IMAGE;

  if (typeof v === "string") {
    const clean = v.trim();
    return clean.startsWith("http") ? clean : FALLBACK_IMAGE;
  }

  if (typeof v === "object") {
    const img =
      v?.url ||
      v?.image ||
      v?.src ||
      "";

    return typeof img === "string" && img.startsWith("http")
      ? img
      : FALLBACK_IMAGE;
  }

  return FALLBACK_IMAGE;
}

/* ================= NUMBER ================= */
export function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/* ================= BOOLEAN ================= */
export function safeBoolean(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") return v === "true";
  return false;
}

/* ================= PRODUCT NORMALIZER (IMPORTANT) ================= */
export function normalizeProduct(p = {}) {
  if (!p || typeof p !== "object") {
    return null;
  }

  return {
    id: safeText(p.id),

    title: safeText(p.title),
    description: safeText(p.description),

    image: safeImage(p.image),

    price: safeNumber(p.price),
    rating: safeNumber(p.rating),

    views: safeNumber(p.views),
    clicks: safeNumber(p.clicks),
    orders: safeNumber(p.orders),

    category: safeText(p.category),

    viralBoost: safeBoolean(p.viralBoost),

    link: safeText(p.link),
  };
}
