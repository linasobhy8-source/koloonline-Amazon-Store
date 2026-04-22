import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!asin) return;

    async function fetchProduct() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        const found = data.products.find(p => p.asin === asin);
        setProduct(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [asin]);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  if (!product)
    return <h2 style={{ textAlign: "center" }}>Product Not Found</h2>;

  function buyNow() {
    const tag = product.tag?.US || "defaulttag";
    window.open(
      `https://www.amazon.com/dp/${product.asin}?tag=${tag}`,
      "_blank"
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>{product.title}</h1>

      <img
        src={product.image}
        style={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
      />

      <h2 style={{ color: "#b12704" }}>${product.price}</h2>

      <button
        onClick={buyNow}
        style={{
          background: "#ff9900",
          padding: 12,
          width: "100%",
          border: "none",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        🛒 Buy on Amazon
      </button>

      <p style={{ marginTop: 20 }}>
        This is a high-quality product selected for best performance and user satisfaction.
      </p>
    </div>
  );
}
