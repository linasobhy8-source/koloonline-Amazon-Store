import useProducts from "../hooks/useProducts";
import { safeText, safeImage } from "../lib/safe";

export default function Products() {
  const { products = [], loading } = useProducts();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Products</h1>

      {Array.isArray(products) &&
        products.map((p) => (
          <div key={String(p?.id || Math.random())}>
            <img
              src={safeImage(p?.image)}
              alt={safeText(p?.title)}
              width={100}
              loading="lazy"
            />

            <p>{safeText(p?.title)}</p>
          </div>
        ))}
    </div>
  );
                }
