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

  if (typeof v === "object") {
    // Firebase Timestamp support
    if (v?.toDate && typeof v.toDate === "function") {
      try {
        return v.toDate().toISOString();
      } catch {
        return "";
      }
    }

    // avoid returning raw objects
    return JSON.stringify(v || "");
  }

  return "";
};

export const safeImage = (img, fallback = "https://via.placeholder.com/500x500") => {
  if (typeof img !== "string") return fallback;

  const clean = img.trim();

  if (!clean) return fallback;

  // block invalid urls
  if (!clean.startsWith("http")) return fallback;

  return clean;
};

export const safeProduct = (p) => {
  if (!p || typeof p !== "object") return null;

  return {
    id: safeText(p.id),
    title: safeText(p.title),
    description: safeText(p.description),
    image: safeText(p.image),
    link: safeText(p.link),
    category: safeText(p.category),
    price: safeText(p.price),
    score: safeText(p.score),
    views: safeText(p.views),
    clicks: safeText(p.clicks),
  };
};
