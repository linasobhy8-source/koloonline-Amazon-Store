// lib/normalizeProduct.js

export function normalizeProduct(raw = {}) {
  return {
    id: String(raw?.id ?? ""),

    title: extractText(raw?.title),
    description: extractText(raw?.description),

    image: extractImage(raw?.image),

    price: extractNumber(raw?.price),

    category: extractText(raw?.category),

    score: extractNumber(raw?.score ?? raw?.rating),

    views: extractNumber(raw?.views),
    clicks: extractNumber(raw?.clicks),
    orders: extractNumber(raw?.orders),

    rating: extractNumber(raw?.rating),

    viralBoost: Boolean(
      raw?.viralBoost ||
      raw?.["viral boost"] ||
      raw?.["viralBoost"]
    ),
  };
}

/* ================= TEXT SAFE ================= */
function extractText(value) {
  if (value === null || value === undefined) return "";

  if (typeof value === "string") return value;

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(extractText).join(" ");
  }

  if (typeof value === "object") {
    return (
      extractText(value.text) ||
      extractText(value.value) ||
      extractText(value.title) ||
      extractText(value.name) ||
      ""
    );
  }

  return "";
}

/* ================= IMAGE SAFE ================= */
function extractImage(value) {
  const fallback = "https://via.placeholder.com/500x500";

  if (!value) return fallback;

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    return (
      value?.url ||
      value?.image ||
      value?.src ||
      value?.thumbnail ||
      fallback
    );
  }

  return fallback;
}

/* ================= NUMBER SAFE ================= */
function extractNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
