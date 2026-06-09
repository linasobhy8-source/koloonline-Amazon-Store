export const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  // Firebase Timestamp support
  if (v && typeof v.toDate === "function") {
    try {
      return v.toDate().toISOString();
    } catch {
      return "";
    }
  }

  // ❌ prevent React crash completely
  return "";
};

export const safeImage = (
  v,
  fallback = "https://via.placeholder.com/500x500"
) => {
  if (typeof v !== "string") return fallback;

  const img = v.trim();

  if (!img) return fallback;

  if (!img.startsWith("http")) return fallback;

  return img;
};
