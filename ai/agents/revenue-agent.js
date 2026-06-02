export function updateProductBrain(product, event) {
  const base = product.aiWeight || 1;

  switch (event) {
    case "click":
      return base + 0.05;

    case "buy":
      return base + 0.5;

    case "ignore":
      return base - 0.02;

    default:
      return base;
  }
}
