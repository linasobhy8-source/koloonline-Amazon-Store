export function calculateViralScore(product) {
  return (
    (product.views || 0) * 1 +
    (product.clicks || 0) * 4 +
    (product.rating || 0) * 20
  );
}
