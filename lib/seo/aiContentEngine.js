 /* ================= AI CONTENT ENGINE (OPTIMIZED) ================= */

const safeTitle = (p) =>
  typeof p?.title === "string" ? p.title : "this product";

/* ================= WHY SECTION ================= */
export function generateWhySection(product) {
  if (!product) return "";

  const title = safeTitle(product);

  return `${title} is gaining strong attention due to its combination of affordability, usability, and positive user demand trends. It has been highlighted as a value-driven choice among similar products in its category.`;
}

/* ================= HIGHLIGHTS ================= */
export function generateHighlights(product) {
  if (!product) return [];

  return [
    "🔥 Currently trending product",
    "⭐ High customer interest",
    "💰 Competitive pricing",
    "🚀 Fast-growing demand",
    "🛍️ Suitable for everyday use",
  ];
}

/* ================= FAQ (SEO OPTIMIZED) ================= */
export function generateFAQ(product) {
  const title = safeTitle(product);

  return [
    {
      q: `Why is ${title} popular?`,
      a: `${title} is popular because it offers a strong balance between price, quality, and user satisfaction.`,
    },
    {
      q: `Is ${title} a good purchase?`,
      a: `Yes, ${title} is considered a good purchase for users looking for value and reliability.`,
    },
    {
      q: "Do Amazon prices change?",
      a: "Yes, prices change frequently based on demand, offers, and stock availability.",
    },
  ];
}

/* ================= PROS ================= */
export function generatePros(product) {
  return [
    "Good value for money",
    "Popular among buyers",
    "Modern and practical design",
    "Reliable user demand",
    "Strong market interest",
  ];
}

/* ================= CONS ================= */
export function generateCons() {
  return [
    "Stock availability may change quickly",
    "Price fluctuations on Amazon",
    "May vary by region",
  ];
}
