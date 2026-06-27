export const normalizeProduct = (raw = {}) => {
  const safeString = (v) => {
    if (v == null) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (typeof v === "object") {
      return v?.title || v?.name || v?.text || "";
    }
    return "";
  };

  const safeNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const safeImage = (v) => {
    if (typeof v === "string" && v.startsWith("http")) return v;
    return "https://via.placeholder.com/300?text=Koloonline";
  };

  return {
    id: safeString(raw.id),
    title: safeString(raw.title),
    image: safeImage(raw.image),
    price: safeNumber(raw.price),
  };
};
