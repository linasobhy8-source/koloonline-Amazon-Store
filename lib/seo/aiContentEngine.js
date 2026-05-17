/* ================= AI CONTENT ENGINE ================= */
/* SEO Content Generator for Product Pages */

export function generateWhySection(product) {
  if (!product) return "";

  return `${product.title} is a high-demand product that attracts buyers due to its balance between quality, price, and usability. It is currently trending based on customer engagement and market interest.`;
}

/* ================= HIGHLIGHTS ================= */
export function generateHighlights(product) {
  if (!product) return [];

  return [
    "🔥 Trending Amazon product",
    "⭐ High customer engagement",
    "💰 Good value for money",
    "🚀 Fast growing demand",
    "🛍️ Ideal for daily use",
  ];
}

/* ================= FAQ ================= */
export function generateFAQ(product) {
  if (!product) return [];

  return [
    {
      q: `Is ${product.title} worth buying?`,
      a: "Yes, it is considered a good value product based on demand and customer feedback.",
    },
    {
      q: "Does the price change often?",
      a: "Yes, Amazon prices change frequently depending on offers and availability.",
    },
    {
      q: "Is this product trending?",
      a: "Yes, it is currently gaining strong customer interest.",
    },
  ];
}

/* ================= PROS ================= */
export function generatePros() {
  return [
    "Affordable price",
    "Popular among buyers",
    "Modern design",
    "Good quality perception",
    "High demand",
  ];
}

/* ================= CONS ================= */
export function generateCons() {
  return [
    "Stock may run out quickly",
    "Price changes frequently",
    "Limited availability in some regions",
  ];
}
