export const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (typeof v === "object") {
    if (v?.toDate) {
      try {
        return v.toDate().toISOString();
      } catch {
        return "";
      }
    }

    return v?.text || v?.title || v?.value || "";
  }

  return "";
};

/* ================= IMAGE ================= */
export const safeImage = (v) => {
  const fallback = "https://via.placeholder.com/500x500";

  if (!v) return fallback;

  if (typeof v === "string") return v.startsWith("http") ? v : fallback;

  if (typeof v === "object") {
    return v?.url || v?.image || v?.src || fallback;
  }

  return fallback;
};

/* ================= SAFE NUMBER ================= */
export const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= SAFE OBJECT ================= */
export const safeObject = (obj) => {
  if (!obj || typeof obj !== "object") return null;

  return {
    id: safeText(obj?.id),

    title: safeText(obj?.title),
    description: safeText(obj?.description),
    category: safeText(obj?.category),

    image: safeImage(obj?.image),

    price: safeNumber(obj?.price),
    rating: safeNumber(obj?.rating),
    views: safeNumber(obj?.views),
    clicks: safeNumber(obj?.clicks),
    orders: safeNumber(obj?.orders),

    viralBoost: Boolean(obj?.viralBoost),
  };
};
