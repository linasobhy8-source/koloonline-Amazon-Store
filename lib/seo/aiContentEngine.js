export function generateWhySection(product) {
  if (!product) return "";

  return `${product.title} is a high-demand product that attracts buyers due to its balance between quality, price, and usability. It is currently trending based on customer engagement and market interest.`;
}

export function generateHighlights(product) {
  const base = [
    "Trending Amazon product",
    "High customer demand",
    "Competitive pricing",
    "Good value for money",
  ];

  if (product.category) {
    base.push(`Popular in ${product.category} category`);
  }

  return base;
}

export function generateFAQ(product) {
  return [
    {
      q: `Is ${product.title} worth buying?`,
      a: `Yes, it is considered a strong value product based on demand and user interest.`,
    },
    {
      q: `Is this product trending?`,
      a: `Yes, it is currently showing increased engagement and popularity.`,
    },
    {
      q: `Does price change often?`,
      a: `Yes, Amazon prices change frequently depending on demand and offers.`,
    },
  ];
}

export function generatePros(product) {
  return [
    "Affordable and competitive price",
    "Strong customer demand",
    "Reliable product category",
  ];
}

export function generateCons() {
  return [
    "Stock may change quickly",
    "Price fluctuations possible",
    "Availability may vary by region",
  ];
}
