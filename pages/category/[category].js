import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (category) fetchProducts();
  }, [category]);

  async function fetchProducts() {
    try {
      const snap = await getDocs(collection(db, "products"));

      const filtered = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => p.category === category);

      setProducts(filtered);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>📦 {category}</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 20,
        }}
      >
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.asin || p.id}`}>
            <div style={card}>
              <img src={p.image} width="100%" />
              <h4>{p.title}</h4>
              <p>${p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: 10,
  borderRadius: 10,
  cursor: "pointer",
};
