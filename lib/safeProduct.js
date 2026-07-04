const FALLBACK_IMAGE =
  "https://via.placeholder.com/300?text=Koloonline";

/* ================= SAFE CORE ================= */
export const safeText = (v) => {
  if (v == null) return "";

  if (typeof v === "string") return v.trim();

  if (typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (typeof v === "object") {
    return (
      safeText(v?.title) ||
      safeText(v?.name) ||
      safeText(v?.text) ||
      safeText(v?.value) ||
      ""
    );
  }

  return "";
};

export const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const safeImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;

  if (typeof v === "object" && v !== null) {
    const img = v.url || v.image || v.src;
    if (typeof img === "string" && img.startsWith("http")) return img;
  }

  return FALLBACK_IMAGE;
};

/* ================= NORMALIZER ================= */
export const normalizeProduct = (p) => {
  if (!p || typeof p !== "object") return null;

  const id = safeText(p.id || p._id || p.asin);
  if (!id) return null;

  return {
    id,
    title: safeText(p.title),
    image: safeImage(p.image),
    price: safeNumber(p.price),
    category: safeText(p.category),
    rating: safeNumber(p.rating),
    views: safeNumber(p.views),
  };
};
