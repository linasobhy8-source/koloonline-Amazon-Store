import useProducts from "../hooks/useProducts";
import { safeText, safeImage } from "../lib/safe";

export default function Products() {
  const { products, loading } = useProducts();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Products</h1>

      {products?.map((p) => (
        <div key={p.id}>
          <img src={safeImage(p.image)} width={100} />
          <p>{safeText(p.title)}</p>
        </div>
      ))}
    </div>
  );
}
