/* ================= FALLBACK IMAGE ================= */

const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x500?text=Koloonline";

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

    link:
      typeof raw?.link === "string"
        ? raw.link
        : "",

    viralBoost: Boolean(raw?.viralBoost),
  };
}

/* ================= SAFE TEXT ================= */

function safeText(v) {
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
      .join(" ");
  }

  if (typeof v === "object") {
    if (typeof v.text === "string") {
      return v.text;
    }

    if (typeof v.title === "string") {
      return v.title;
    }

    if (typeof v.value === "string") {
      return v.value;
    }

    if (typeof v.name === "string") {
      return v.name;
    }

    return "";
  }

  return "";
}

/* ================= SAFE IMAGE ================= */

function safeImage(v) {
  if (!v) {
    return FALLBACK_IMAGE;
  }

  if (
    typeof v === "string" &&
    v.trim().length > 0
  ) {
    return v.trim();
  }

  if (typeof v === "object") {
    if (
      typeof v.url === "string" &&
      v.url.trim()
    ) {
      return v.url.trim();
    }

    if (
      typeof v.image === "string" &&
      v.image.trim()
    ) {
      return v.image.trim();
    }

    if (
      typeof v.src === "string" &&
      v.src.trim()
    ) {
      return v.src.trim();
    }
  }

  return FALLBACK_IMAGE;
}

/* ================= SAFE NUMBER ================= */

function safeNumber(v) {
  const n = Number(v);

  return Number.isFinite(n)
    ? n
    : 0;
    }
