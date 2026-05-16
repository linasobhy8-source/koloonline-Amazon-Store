export default function ProductSchema({ product }) {
  if (!product) return null;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.image,
    description: product.description || product.title,
    offers: {
      "@type": "Offer",
      price: product.price || "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: product.link,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
