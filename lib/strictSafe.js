export const safeText = (v) => {
  if (v == null) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.map(safeText).join(" ");

  if (typeof v === "object") {
    return (
      v?.title ||
      v?.name ||
      v?.text ||
      v?.value ||
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
  return "https://via.placeholder.com/300?text=Koloonline";
};

/* 🔥 أهم Function */
export const deepSanitizeProduct = (p = {}) => {
  return {
    id: safeText(p.id),
    title: safeText(p.title),
    price: safeNumber(p.price),
    image: safeImage(p.image),
  };
};
