export function calculateRevenueForecast(products) {
  return products.reduce((acc, p) => {
    const revenue = (p.orders || 0) * (p.price || 10);
    return acc + revenue;
  }, 0);
}
