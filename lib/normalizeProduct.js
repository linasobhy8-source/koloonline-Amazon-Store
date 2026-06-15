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
      raw?.["viral boost"]
    ),
  };
}

/* TEXT */
function extractText(v) {
  if (v == null) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.map(extractText).join(" ");

  if (typeof v === "object") {
    return (
      extractText(v.text) ||
      extractText(v.value) ||
      extractText(v.title) ||
      extractText(v.name) ||
      ""
    );
  }

  return "";
}

/* IMAGE */
function extractImage(v) {
  const fallback = "https://via.placeholder.com/500x500";

  if (!v) return fallback;
  if (typeof v === "string") return v;

  if (typeof v === "object") {
    return v.url || v.image || v.src || fallback;
  }

  return fallback;
}

/* NUMBER */
function extractNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
