
/* ================= SAFE HELPERS ================= */
const safeText = (text) =>
  typeof text === "string" && text.trim().length > 0
    ? text.trim()
    : "";

const safeNumber = (num, fallback) =>
  typeof num === "number" && !isNaN(num) ? num : fallback;

/* ================= PRODUCT SCHEMA ================= */
export function generateProductSchema(product, url) {
  if (!product || !url) return null;

  const title = safeText(product.title);
  const description = safeText(product.description) || title;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",

    name: title,
    image: product.image || "",
    description,

    sku: product.asin || "",

    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: safeNumber(product.price, null),
      availability: "https://schema.org/InStock",
      url,
    },

    /* ================= REALISTIC RATING ================= */
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: safeNumber(product.rating, 4.2),
          reviewCount: safeNumber(product.reviewCount, 1),
        }
      : undefined,
  };
}

/* ================= FAQ SCHEMA (SEO SAFE DYNAMIC) ================= */
export function generateFAQSchema(product) {
  if (!product) return null;

  const title = safeText(product.title);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${title} used for?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${title} is used for everyday practical purposes depending on its category and features.`,
        },
      },

      {
        "@type": "Question",
        name: `Is ${title} worth buying?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${title} can be a good choice depending on current price, user needs, and seller conditions.`,
        },
      },

      {
        "@type": "Question",
        name: `Where can I buy ${title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${title} is typically available on Amazon through different sellers, depending on stock availability.`,
        },
      },
    ],
  };
}

/* ================= BREADCRUMB SCHEMA ================= */
export function generateBreadcrumbSchema(product, url) {
  if (!product || !url) return null;

  const title = safeText(product.title);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    item
