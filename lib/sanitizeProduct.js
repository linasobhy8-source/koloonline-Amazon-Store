export const sanitizeProduct = (p = {}) => {
  const safeString = (v) => {
    if (v == null) return "";

    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);

    if (Array.isArray(v)) return v.map(safeString).join(" ");

    if (typeof v === "object") {
      return (
        v.title ||
        v.name ||
        v.text ||
        v.value ||
        ""
      );
    }

    return "";
  };

  const safeNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  return {
    id: safeString(p.id),
    title: safeString(p.title),
    image: safeString(p.image),
    price: safeNumber(p.price),
  };
};
