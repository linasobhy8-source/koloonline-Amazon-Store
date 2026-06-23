export const safeText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(safeText).join(" ");
  if (typeof v === "object") return v.title || v.text || v.name || "";
  return "";
};

export const safeImage = (v) => {
  const fallback = "https://via.placeholder.com/300x300?text=Koloonline";

  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null) {
    return v.url || v.image || v.src || fallback;
  }
  return fallback;
};

export const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
