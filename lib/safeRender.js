/* ================= SAFE TEXT ================= */

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
    return v
      .map(safeText)
      .filter(Boolean)
      .join(" ");
  }

  if (typeof v === "object") {
    // Firebase Timestamp
    if (
      v?.toDate &&
      typeof v.toDate === "function"
    ) {
      try {
        return v.toDate().toISOString();
      } catch {
        return "";
      }
    }

    try {
      return JSON.stringify(v);
    } catch {
      return "";
    }
  }

  return "";
};

/* ================= SAFE IMAGE ================= */

export const safeImage = (
  img,
  fallback = "https://via.placeholder.com/500x500?text=Koloonline"
) => {
  if (!img) return fallback;

  if (typeof img === "string") {
    const clean = img.trim();

    if (!clean) return fallback;

    if (
      clean.startsWith("http://") ||
      clean.startsWith("https://")
    ) {
      return clean;
    }

    return fallback;
  }

  if (typeof img === "object") {
    const candidate =
      img?.url ||
      img?.src ||
      img?.image ||
      "";

    if (
      typeof candidate === "string" &&
      (candidate.startsWith("http://") ||
        candidate.startsWith("https://"))
    ) {
      return candidate;
    }
  }

  return fallback;
};

/* ================= SAFE PRODUCT ================= */

export const safeProduct = (p) => {
  if (!p || typeof p !== "object") {
    return null;
  }

  return {
    id: safeText(p?.id),

    title: safeText(p?.title),
    description: safeText(p?.description),

    image: safeImage(p?.image),

    link: safeText(p?.link),
    category: safeText(p?.category),

    price: Number(p?.price || 0),
    score: Number(p?.score || 0),
    views: Number(p?.views || 0),
    clicks: Number(p?.clicks || 0),
  };
};
