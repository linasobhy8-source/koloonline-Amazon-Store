export const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (v?.toDate) {
    try {
      return v.toDate().toISOString();
    } catch {
      return "";
    }
  }

  return "";
};

export const safeImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;
  if (v?.url) return v.url;
  if (v?.image) return v.image;

  return "https://via.placeholder.com/500x500";
};

export const safeObject = (obj) => {
  if (!obj || typeof obj !== "object") return null;

  return {
    id: safeText(obj.id),
    title: safeText(obj.title),
    description: safeText(obj.description),
    image: safeImage(obj.image),
    price: safeText(obj.price),
    category: safeText(obj.category),
  };
};
