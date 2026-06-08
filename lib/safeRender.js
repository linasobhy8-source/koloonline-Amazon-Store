export const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (typeof v === "object") {
    if (v?.toDate) return v.toDate().toISOString();
    return "";
  }

  return "";
};

export const safeImage = (img, fallback) => {
  if (typeof img !== "string") return fallback;
  if (!img.trim()) return fallback;
  return img;
};

export const safeProduct = (p) => {
  if (!p || typeof p !== "object") return null;

  return {
    id: safeText(p.id),
    title: safeText(p.title),
    description: safeText(p.description),
    image: safeText(p.image),
    price: safeText(p.price),
  };
};
