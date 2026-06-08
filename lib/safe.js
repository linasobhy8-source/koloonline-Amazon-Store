export const safeText = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(safeText).join(" ");
  return "";
};

export const safeImage = (v, fallback = "https://via.placeholder.com/500x500") => {
  if (typeof v !== "string") return fallback;
  return v;
};
