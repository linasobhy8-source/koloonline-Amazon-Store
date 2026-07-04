
/* ================= SAFE TITLE ================= */
const safeTitle = (p) =>
  typeof p?.title === "string" && p.title.trim().length > 0
    ? p.title.trim()
    : "this product";

/* ================= CLEAN TEXT HELPER ================= */
const clean = (text) =>
  typeof text === "string" ? text.replace(/\s+/g, " ").trim() : "";

/* ================= WHY SECTION (SEO IMPROVED) ================= */
export function generateWhySection(product) {
  if (!product) return "";

  const title = safeTitle(product);

  const price = product?.price ? `priced competitively at ${product.price}` : "";

  const brand = product?.brand ? `from a trusted brand like ${product.brand}` : "";

  return clean(`
${title} is a trending product that attracts attention due to its strong balance of value, usability, and market demand.
It is ${price} ${brand}. Users often choose it for its practical benefits and overall reliability in its category.
  `);
}

/* ================= HIGHLIGHTS (SEO + REAL VALUE) ================= */
export function generateHighlights(product) {
  if (!product) return [];

  const title = safeTitle(product);

  return [
    `🔥 ${title} is currently gaining market attention`,
    "⭐ Frequently chosen by online shoppers",
    "💰 Offers competitive value compared to alternatives",
    "🚀 Demand is increasing across Amazon listings",
    "🛍️ Suitable for practical everyday use cases",
  ];
}

/* ================= FAQ (SEO OPTIMIZED + LESS SPAMMY) ================= */
export function generateFAQ(product) {
  const title = safeTitle(product);

  return [
    {
      q: `What makes ${title} worth considering?`,
      a: `${title} is worth considering because it balances price, usability, and customer demand in its category.`,
    },
    {
      q: `Who should buy ${title}?`,
      a: `${title} is suitable for users looking for practical functionality and general everyday use.`,
    },
    {
      q: `Does ${title} have good value for money?`,
      a: `Yes, ${title} is generally considered a value-oriented product depending on current pricing and offers.`,
    },
    {
      q: "Do product prices change on Amazon?",
      a: "Yes, Amazon prices change frequently based on stock availability, demand, and promotions.",
    },
  ];
}

/* ================= PROS (LESS GENERIC = BETTER SEO) ================= */
export function generatePros(product) {
  const title = safeTitle(product);

  return [
    `${title} is widely used by customers`,
    "Good balance between quality and price",
    "Easy to use in daily situations",
    "Popular choice in its category",
    "Offers practical functionality",
  ];
}

/* ================= CONS (MORE REALISTIC SEO) ================= */
export function generateCons() {
  return [
    "Availability may vary depending on stock",
    "Prices may change frequently on Amazon",
    "Features may differ between sellers or versions",
  ];
}
