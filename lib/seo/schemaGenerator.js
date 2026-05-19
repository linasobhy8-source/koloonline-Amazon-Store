export function generateProductSchema(product, url) {
  if (!product) return null;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",

    name: product.title,
    image: product.image,
    description: product.description || product.title,
    sku: product.asin,

    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      url,
    },

    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 4.3,
      reviewCount: product.reviewCount || 1,
    },
  };
}

/* ================= FAQ SCHEMA ================= */
export function generateFAQSchema(product) {
  if (!product) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${product.title} worth buying?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, this product is trending due to its value, quality, and customer demand.",
        },
      },

      {
        "@type": "Question",
        name: `Does ${product.title} come with warranty?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Warranty depends on the seller on Amazon, always check product listing details.",
        },
      },

      {
        "@type": "Question",
        name: `Is ${product.title} available now?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, it is currently available but stock may change quickly due to demand.",
        },
      },
    ],
  };
}

/* ================= BREADCRUMB SCHEMA ================= */
export function generateBreadcrumbSchema(product, url) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://koloonline.online",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://koloonline.online/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: url,
      },
    ],
  };
        }
