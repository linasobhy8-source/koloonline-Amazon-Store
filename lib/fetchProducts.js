export async function fetchProducts() {
  const res = await fetch("/api/products-lite");
  return res.json();
}
