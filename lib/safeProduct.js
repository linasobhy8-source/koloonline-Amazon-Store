/* ================= NORMALIZER ================= */
export const normalizeProduct = (p = {}) => {
  if (!p || typeof p !== "object") return null;

  const id = safeText(
    p.id ||
    p.slug ||
    p.asin ||
    p._id
  );

  if (!id) return null;

  return {
    id,

    slug: safeText(p.slug),

    asin: safeText(
      p.asin || p.id
    ),

    title: safeText(p.title),

    description: safeText(
      p.description
    ),

    image: safeImage(p.image),

    price: safeNumber(p.price),

    category: safeText(p.category),

    rating: safeNumber(p.rating),

    views: safeNumber(p.views),

    clicks: safeNumber(p.clicks),

    orders: safeNumber(p.orders),

    score: safeNumber(p.score),

    viralBoost: Boolean(p.viralBoost),

    link: safeText(p.link),

    createdAt: p.createdAt || null,

    updatedAt: p.updatedAt || null,
  };
};
