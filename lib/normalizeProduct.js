// lib/normalizeProduct.js

export function normalizeProduct(raw = {}) {
  return {
    id: String(raw?.id || ""),

    title: extractText(raw?.title),

    description: extractText(raw?.description),

    image: extractImage(raw?.image),

    price: extractNumber(raw?.price),

    category: extractText(raw?.category),

    score: extractNumber(raw?.score || raw?.rating),

    views: extractNumber(raw?.views),

    clicks: extractNumber(raw?.clicks),

    viralBoost: Boolean(
      raw?.viralBoost ||
      raw?.["viral boost"] ||
      raw?.["تعزيز الانتشار الفيروسي"]
    ),
  };
}

/* ================= HELPERS ================= */

function extractText(value) {
  if (value === null || value === undefined) return "";

  if (typeof value === "string") return value;

  if (typeof value === "number") return String(value);

  if (typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    return value.map(extractText).join(" ");
  }

  if (typeof value === "object") {
    return (
      value?.text ||
      value?.value ||
      value?.title ||
      ""
    );
  }

  return "";
}

function extractImage(value) {
  const fallback = "https://via.placeholder.com/500x500";

  if (!value) return fallback;

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    return value?.url || value?.image || fallback;
  }

  return fallback;
}

function extractNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}
