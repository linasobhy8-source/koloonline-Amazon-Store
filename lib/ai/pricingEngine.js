export function pricingEngine(product) {
  if (!product) return 0;

  if ((product.views || 0) > 1000) {
    return product.price * 1.1;
  }

  return product.price;
}
