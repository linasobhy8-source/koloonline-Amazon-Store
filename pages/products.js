import useProducts from "../hooks/useProducts";

export default function Products() {
  const { products, loading } = useProducts();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {products.map((p) => (
        <div key={p.id}>
          <img src={p.image} alt={p.title} />
          <h3>{p.title}</h3>
        </div>
      ))}
    </div>
  );
}
