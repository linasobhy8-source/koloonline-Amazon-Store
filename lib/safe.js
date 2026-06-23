export const safeText = (v) => {
  if (v == null) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) return v.map(safeText).join(" ");

  if (typeof v === "object") {
    return v?.text || v?.title || v?.name || v?.value || "";
  }

  return "";
};

export const safeImage = (v) => {
  const fallback =
    "https://via.placeholder.com/300x300?text=Koloonline";

  if (typeof v === "string" && v.startsWith("http")) return v;

  if (typeof v === "object") {
    const img = v?.url || v?.image || v?.src;
    if (typeof img === "string" && img.startsWith("http")) return img;
  }

  return fallback;
};
