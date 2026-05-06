export function getProductSEO(product) {
  return {
    title: `${product.title} | Koloonline`,
    description: product.title,
    canonical: `https://koloonline.online/product/${product.asin}`,
  };
}

export function getCategorySEO(category) {
  return {
    title: `${category} | Koloonline Categories`,
    canonical: `https://koloonline.online/category/${category}`,
  };
}
