export const safe = (v) => {
  if (v == null) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.map(safe).join(" ");

  if (typeof v === "object") {
    try {
      return (
        v?.title ||
        v?.name ||
        v?.text ||
        v?.value ||
        ""
      );
    } catch {
      return "";
    }
  }

  return "";
};

export const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const safeImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;
  return "https://via.placeholder.com/300";
};

/* 🔥 أهم Function */
export const deepSanitize = (p = {}) => {
  return {
    id: safe(p.id),
    title: safe(p.title),
    price: safeNumber(p.price),
    image: safeImage(p.image),
  };
};
