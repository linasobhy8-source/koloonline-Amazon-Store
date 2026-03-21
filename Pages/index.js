export default function ProductCard({ product }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 10 }}>
      <h3>{product?.ItemInfo?.Title?.DisplayValue}</h3>
      <p>{product?.Offers?.Listings?.[0]?.Price?.DisplayAmount}</p>
    </div>
  );
}