/* ================= SAFE TEXT ================= */

export const safeText = (v) => {
  if (v === null || v === undefined) {
    return "";
  }

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
    /* Firebase Timestamp */
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

    /* Common object formats */
    if (typeof v.text === "string") {
      return v.text;
    }

    if (typeof v.title === "string") {
      return v.title;
    }

    if (typeof v.value === "string") {
      return v.value;
    }

    if (typeof v.name === "string") {
      return v.name;
    }

    return "";
  }

  return "";
};

/* ================= SAFE IMAGE ================= */

export const safeImage = (
  img,
  fallback = "https://via.placeholder.com/500x500?text=Koloonline"
) => {
  if (!img) {
    return fallback;
  }

  if (typeof img === "string") {
    const clean = img.trim();

    if (
      clean &&
      (clean.startsWith("https://") ||
        clean.startsWith("http://"))
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
      (candidate.startsWith("https://") ||
        candidate.startsWith("http://"))
    ) {
      return candidate;
    }
  }

  return fallback;
};

/* ================= SAFE NUMBER ================= */

export const safeNumber = (v) => {
  const n = Number(v);

  return Number.isFinite(n)
    ? n
    : 0;
};

/* ================= SAFE PRODUCT ================= */

export const safeProduct = (p) => {
  if (!p || typeof p !== "object") {
    return null;
  }

  return {
    id: safeText(p.id),

    title: safeText(p.title),
    description: safeText(p.description),

    image: safeImage(p.image),

    link: safeText(p.link),
    category: safeText(p.category),

    price: safeNumber(p.price),
    score: safeNumber(p.score),

    views: safeNumber(p.views),
    clicks: safeNumber(p.clicks),

    rating: safeNumber(p.rating),

    viralBoost: Boolean(p.viralBoost),
  };
};
