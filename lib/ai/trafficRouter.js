export function trafficRouter(products = []) {
  return products.filter(p => (p.views || 0) > 50);
}
