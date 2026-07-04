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
      safeText(v.title) ||
      safeText(v.name) ||
      safeText(v.text) ||
      safeText(v.value) ||
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
  const fallback =
    "https://via.placeholder.com/500x500?text=Koloonline";

  if (typeof v === "string" && v.startsWith("http")) return v;

  if (typeof v === "object" && v !== null) {
    const img =
      v.url ||
      v.image ||
      v.src ||
      v.thumbnail ||
      v.large;

    if (typeof img === "string" && img.startsWith("http")) {
      return img;
    }
  }

  return fallback;
};
