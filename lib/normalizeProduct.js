// lib/normalizeProduct.js

export function normalizeProduct(raw = {}) {
  const safe = (v) => extractText(v);

  return {
    id: String(raw?.id || ""),

    title: safe(raw?.title),
    description: safe(raw?.description),

    image: extractImage(raw?.image),

    price: extractNumber(raw?.price),

    category: safe(raw?.category),

    score: extractNumber(raw?.score ?? raw?.rating),

    views: extractNumber(raw?.views),
    clicks: extractNumber(raw?.clicks),

    viralBoost: Boolean(
      raw?.viralBoost ||
        raw?.["viral boost"] ||
        raw?.["تعزيز الانتشار الفيروسي"]
    ),
  };
}

/* ================= TEXT ================= */
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
      value?.text ||
      value?.value ||
      value?.title ||
      value?.name ||
      ""
    );
  }

  return "";
}

/* ================= IMAGE ================= */
function extractImage(value) {
  const fallback = "https://via.placeholder.com/500x500";

  if (!value) return fallback;

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    return value?.url || value?.image || value?.src || fallback;
  }

  return fallback;
}

/* ================= NUMBER ================= */
function extractNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
      }
