import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ================= CATEGORY PAGE (AI ENHANCED) ================= */

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    if (category) fetchProducts();
  }, [category]);

  async function fetchProducts() {
    try {
      setLoading(true);

      const snap = await getDocs(collection(db, "products"));

      const normalizedCategory = (category || "").toLowerCase();

      const all = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setAllProducts(all);

      let filtered = all
        .filter((p) => {
          return (p.category || "").toLowerCase() === normalizedCategory;
        })
        .map((p) => {
          /* ================= AI TREND ENGINE ================= */
          const trendScore =
            (p.score || 0) * 3 +
            (p.clicks || 0) * 2 +
            (p.views || 0) * 1 +
            (p.orders || 0) * 5 +
            (p.viralBoost ? 50 : 0);

          return {
            ...p,
            trendScore,
          };
        })
        .sort((a, b) => b.trendScore - a.trendScore);

      setProducts(filtered);
    } catch (err) {
      console.error("Category fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  /* ================= RELATED CATEGORIES ================= */

  const relatedCategories = [
    ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
  ].slice(0, 6);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      {/* ================= HEADER ================= */}
      <h1>📦 {category}</h1>

      {/* ================= RELATED CATEGORIES (SEO BOOST) ================= */}
      {relatedCategories.length > 0 && (
        <div style={{ margin: "15px 0" }}>
          <h3>🔥 Explore Other Categories</h3>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {relatedCategories.map((c) => (
              <Link key={c} href={`/category/${c}`}>
                <span style={{
                  padding: "6px 10px",
                  border: "1px solid #ddd",
                  borderRadius: 20,
                  fontSize: 12,
                  background: "#f5f5f5",
                }}>
                  {c}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ================= LOADING ================= */}
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
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

                {/* ================= VIRAL ================= */}
                {p.viralBoost && (
                  <span style={{
                    background: "linear-gradient(45deg,#ff0000,#ff6600)",
                    color: "white",
                    fontSize: 10,
                    padding: "3px 6px",
                    borderRadius: 6,
                    display: "inline-block",
                    marginTop: 5,
                  }}>
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

/* ================= CARD ================= */
const card = {
  background: "white",
  padding: 12,
  borderRadius: 10,
  cursor: "pointer",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};
