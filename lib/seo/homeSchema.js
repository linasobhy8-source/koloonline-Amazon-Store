export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Koloonline",
    url: "https://koloonline.online",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://koloonline.online/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateItemListSchema(products = []) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",

    itemListElement: products.slice(0, 10).map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: p.title,
      url: `https://koloonline.online/product/${p.id}`,
    })),
  };
}
