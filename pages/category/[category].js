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
      setLoading(true);

      const snap = await getDocs(collection(db, "products"));

      const normalizedCategory = (category || "").toLowerCase();

      let filtered = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        .filter((p) => {
          const productCategory = (p.category || "").toLowerCase();
          return productCategory === normalizedCategory;
        })
        .map((p) => {
          // 🔥 TRENDING + VIRAL BOOST ENGINE
          const trendScore =
            (p.score || 0) * 3 +
            (p.clicks || 0) * 2 +
            (p.views || 0) * 1 +
            (p.viralBoost ? 50 : 0);

          return {
            ...p,
            trendScore,
          };
        })
        .sort((a, b) => b.trendScore - a.trendScore); // 🔥 SORTING

      setProducts(filtered);
    } catch (err) {
      console.error("Category fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      {/* ================= HEADER ================= */}
      <h1 style={{ marginBottom: 20 }}>
        📦 {category ? category : "Category"}
      </h1>

      {/* ================= LOADING ================= */}
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

                {/* ================= IMAGE ================= */}
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

                {/* ================= TITLE ================= */}
                <h4 style={{ marginTop: 10 }}>{p.title}</h4>

                {/* ================= PRICE ================= */}
                <p style={{ color: "#B12704", fontWeight: "bold" }}>
                  ${p.price}
                </p>

                {/* ================= VIRAL BADGE ================= */}
                {p.viralBoost && (
                  <span
                    style={{
                      background: "red",
                      color: "white",
                      fontSize: 10,
                      padding: "3px 6px",
                      borderRadius: 6,
                      display: "inline-block",
                      marginTop: 5,
                    }}
                  >
                    🔥 VIRAL
                  </span>
                )}

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= CARD STYLE ================= */
const card = {
  background: "white",
  padding: 12,
  borderRadius: 10,
  cursor: "pointer",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};
