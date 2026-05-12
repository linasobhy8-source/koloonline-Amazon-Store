import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) fetchProducts();
  }, [category]);

  async function fetchProducts() {
    try {
      const snap = await getDocs(collection(db, "products"));

      const normalizedCategory = (category || "").toLowerCase();

      const filtered = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        .filter((p) => {
          const productCategory = (p.category || "").toLowerCase();
          return productCategory === normalizedCategory;
        });

      setProducts(filtered);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      <h1 style={{ marginBottom: 20 }}>
        📦 {category ? category : "Category"}
      </h1>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found in this category</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 20,
          }}
        >
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.asin || p.id}`}>
              <div style={card}>
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />

                <h4 style={{ marginTop: 10 }}>{p.title}</h4>

                <p style={{ color: "#B12704", fontWeight: "bold" }}>
                  ${p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const card = {
  background: "white",
  padding: 12,
  borderRadius: 10,
  cursor: "pointer",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};
