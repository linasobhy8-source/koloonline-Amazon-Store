/* ================= SAFE TEXT ================= */

export const safeText = (v) => {
  if (v == null) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v
      .map((item) => safeText(item))
      .filter(Boolean)
      .join(" ");
  }

  if (typeof v === "object") {
    try {
      if (typeof v.toDate === "function") {
        return v.toDate().toISOString();
      }

      if (typeof v.text === "string") {
        return v.text;
      }

      if (typeof v.title === "string") {
        return v.title;
      }

      if (typeof v.value === "string") {
        return v.value;
      }

      return JSON.stringify(v);
    } catch {
      return "";
    }
  }

  return "";
};

/* ================= SAFE IMAGE ================= */

export const safeImage = (v) => {
  const fallback =
    "https://via.placeholder.com/500x500?text=Koloonline";

  if (!v) return fallback;

  if (typeof v === "string") {
    return v.startsWith("http")
      ? v
      : fallback;
  }

  if (typeof v === "object") {
    const candidate =
      v?.url ||
      v?.image ||
      v?.src ||
      "";

    if (
      typeof candidate === "string" &&
      candidate.startsWith("http")
    ) {
      return candidate;
    }
  }

  return fallback;
};

/* ================= SAFE NUMBER ================= */

export const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= SAFE OBJECT ================= */

export const safeObject = (obj) => {
  if (!obj || typeof obj !== "object") {
    return {
      id: "",
      title: "",
      description: "",
      category: "",
      image:
        "https://via.placeholder.com/500x500?text=Koloonline",
      price: 0,
      rating: 0,
      views: 0,
      clicks: 0,
      orders: 0,
      viralBoost: false,
    };
  }

  return {
    id: safeText(obj?.id),

    title: safeText(obj?.title),
    description: safeText(obj?.description),
    category: safeText(obj?.category),

    image: safeImage(obj?.image),

    price: safeNumber(obj?.price),
    rating: safeNumber(obj?.rating),
    views: safeNumber(obj?.views),
    clicks: safeNumber(obj?.clicks),
    orders: safeNumber(obj?.orders),

    viralBoost: Boolean(obj?.viralBoost),
  };
};
