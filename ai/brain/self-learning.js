/**
 * Product Brain Update System
 * 
 * This function updates the AI weight of a product based on user behavior events
 * such as clicks, purchases, and ignores.
 * 
 * It is part of the adaptive recommendation engine that helps optimize product
 * ranking, engagement prediction, and revenue performance over time.
 */

export function updateProductBrain(product, event) {
  const base = product.aiWeight || 1;

  let updatedWeight = base;

  switch (event) {
    case "click":
      updatedWeight = base + 0.05;
      break;

    case "buy":
      updatedWeight = base + 0.5;
      break;

    case "ignore":
      updatedWeight = base - 0.02;
      break;

    default:
      updatedWeight = base;
      break;
  }

  // Prevent negative or invalid weights
  if (updatedWeight < 0) updatedWeight = 0;

  return updatedWeight;
}
