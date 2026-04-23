import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProductPage() {
  const router = useRouter();
  const { asin } = router.query;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!asin) return;

    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        const found = data.products.find(p => p.asin === asin);
        setProduct(found);
      });
  }, [asin]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <img src={product.image} width="300" />
      <h1>{product.title}</h1>
      <p>${product.price}</p>

      <button
        onClick={() =>
          window.open(
            `https://www.amazon.com/dp/${product.asin}?tag=${product.tag.US}`,
            "_blank"
          )
        }
      >
        Buy Now
      </button>
    </div>
  );
}
