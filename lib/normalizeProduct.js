export function normalizeProduct(raw = {}) {
  return {
    id: String(raw?.id || ""),

    title: safeText(raw?.title),
    description: safeText(raw?.description),

    image: safeImage(raw?.image),

    price: safeNumber(raw?.price),

    category: safeText(raw?.category),

    rating: safeNumber(raw?.rating),

    views: safeNumber(raw?.views),
    clicks: safeNumber(raw?.clicks),

    link: typeof raw?.link === "string" ? raw.link : "",

    viralBoost: Boolean(raw?.viralBoost),
  };
}

/* ================= SAFE TEXT ================= */
function safeText(v) {
  if (v === null || v === undefined) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.map(safeText).join(" ");

  if (typeof v === "object") {
    return (
      v?.text ||
      v?.title ||
      v?.value ||
      v?.name ||
      JSON.stringify(v) // 🔥 يمنع crash نهائي
    );
  }

  return "";
}

/* ================= SAFE IMAGE ================= */
function safeImage(v) {
  if (!v) return "https://via.placeholder.com/500x500";

  if (typeof v === "string") return v;

  if (typeof v === "object") {
    return v?.url || v?.image || v?.src || "https://via.placeholder.com/500x500";
  }

  return "https://via.placeholder.com/500x500";
}

/* ================= SAFE NUMBER ================= */
function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
