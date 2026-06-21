/* ================= FALLBACK IMAGE ================= */

const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= SAFE TEXT ================= */

function safeText(v) {
  if (v === null || v === undefined) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (typeof v === "object") {
    return (
      v.text ||
      v.title ||
      v.value ||
      v.name ||
      ""
    );
  }

  return "";
}

/* ================= SAFE IMAGE ================= */

function safeImage(v) {
  if (!v) return FALLBACK_IMAGE;

  if (typeof v === "string" && v.trim()) {
    return v.trim();
  }

  if (typeof v === "object") {
    return (
      v.url ||
      v.image ||
      v.src ||
      FALLBACK_IMAGE
    );
  }

  return FALLBACK_IMAGE;
}

/* ================= SAFE NUMBER ================= */

function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/* ================= MAIN NORMALIZER ================= */

export function normalizeProduct(raw = {}) {
  return {
    id: safeText(raw?.id),

    title: safeText(raw?.title),
    description: safeText(raw?.description),

    image: safeImage(raw?.image),

    price: safeNumber(raw?.price),

    category: safeText(raw?.category),

    rating: safeNumber(raw?.rating),

    views: safeNumber(raw?.views),
    clicks: safeNumber(raw?.clicks),

    score: safeNumber(raw?.score),

    link: typeof raw?.link === "string" ? raw.link : "",

    viralBoost: Boolean(raw?.viralBoost),
  };
}
