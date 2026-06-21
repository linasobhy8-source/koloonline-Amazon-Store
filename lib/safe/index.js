const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= TEXT ================= */
export function safeText(v) {
  if (v === null || v === undefined) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (typeof v === "object") {
    return (
      v?.text ||
      v?.title ||
      v?.name ||
      v?.value ||
      JSON.stringify(v)
    );
  }

  return "";
}

/* ================= IMAGE ================= */
export function safeImage(v) {
  if (!v) return FALLBACK_IMAGE;

  if (typeof v === "string" && v.trim()) return v;

  if (typeof v === "object") {
    return (
      v?.url ||
      v?.image ||
      v?.src ||
      FALLBACK_IMAGE
    );
  }

  return FALLBACK_IMAGE;
}

/* ================= NUMBER ================= */
export function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/* ================= PRODUCT NORMALIZER ================= */
export function normalizeProduct(p = {}) {
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

    viralBoost: Boolean(p?.viralBoost),

    link: safeText(p?.link),
  };
}
