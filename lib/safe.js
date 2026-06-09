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

  if (v && typeof v.toDate === "function") {
    try {
      return v.toDate().toISOString();
    } catch {
      return "";
    }
  }

  return "";
};

export const safeImage = (v) => {
  const fallback =
    "https://via.placeholder.com/500x500?text=Product";

  if (typeof v === "string") {
    const img = v.trim();
    if (img.startsWith("http")) return img;
  }

  if (v && typeof v === "object") {
    if (typeof v.url === "string") return v.url;
    if (typeof v.image === "string") return v.image;
  }

  return fallback;
};

export const safeProduct = (p) => {
  if (!p || typeof p !== "object") return null;

  return {
    id: safeText(p.id),
    title: safeText(p.title),
    description: safeText(p.description),
    image: safeImage(p.image),
    link: safeText(p.link),
    category: safeText(p.category),
    price: safeText(p.price),
    score: safeText(p.score),
    views: safeText(p.views),
    clicks: safeText(p.clicks),
    viralBoost: Boolean(p.viralBoost),
  };
};

export const safeProducts = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map(safeProduct).filter(Boolean);
};
