import Head from "next/head";
import { useEffect, useState } from "react";
import { collection, getDocs, query, limit, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase-config";
import Link from "next/link";

/* ================= TRACKING ================= */
async function trackEvent(type, product) {
  try {
    await addDoc(collection(db, "events"), {
      type,
      asin: product?.asin || "",
      title: product?.title || "",
      price: product?.price || 0,
      category: product?.category || "unknown",
      country: navigator.language || "unknown",
      timestamp: serverTimestamp(),
      url: window.location.href
    });
  } catch (err) {
    console.error("Tracking error:", err);
  }
}

/* ================= SKELETON ================= */
function SkeletonCard() {
  return (
    <div style={{
      background: "white",
      padding: 12,
      borderRadius: 10
    }}>
      <div style={{
        height: 180,
        background: "#eee",
        borderRadius: 8,
        animation: "pulse 1.2s infinite"
      }} />
      <div style={{ height: 14, background: "#eee", marginTop: 10 }} />
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), limit(20));
      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        asin: doc.id,
        ...doc.data(),
      }));

      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  /* ================= FILTER ================= */
  const filtered = products.filter((p) => {
    return (
      p.title?.toLowerCase().includes(search.toLowerCase()) &&
      (category === "all" || p.category === category)
    );
  });

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* SEO */}
      <Head>
        <title>Koloonline Store</title>
      </Head>

      {/* HEADER */}
      <header style={{
        background: "#131921",
        color: "white",
        padding: 15,
        display: "flex",
        gap: 10
      }}>
        <h3>🛒 Koloonline Store</h3>
      </header>

      {/* SEARCH */}
      <div style={{ padding: 10, display: "flex", gap: 10 }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: 10 }}
        />

        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
        </select>
      </div>

      {/* PRODUCTS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: 15,
        padding: 20
      }}>

        {loading ? (
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filtered.map((p) => (
            <div key={p.id} style={{
              background: "white",
              padding: 12,
              borderRadius: 10
            }}>

              {/* IMAGE */}
              <img
                src={p.image}
                alt={p.title}
                style={{ width: "100%", height: 180, objectFit: "cover" }}
              />

              <h3>{p.title}</h3>
              <p>${p.price}</p>

              {/* VIEW PRODUCT */}
              <Link href={`/product/${p.asin}`}>
                <button
                  onClick={() => trackEvent("product_click", p)}
                  style={{
                    width: "100%",
                    padding: 10,
                    background: "#ff9900",
                    border: "none",
                    marginTop: 8
                  }}
                >
                  View Product
                </button>
              </Link>

              {/* AMAZON BUY */}
              <button
                onClick={() => {
                  trackEvent("amazon_click", p);

                  const link =
                    p.link ||
                    `https://www.amazon.com/dp/${p.asin}?tag=koloonlinesto-20`;

                  window.open(link, "_blank");
                }}
                style={{
                  width: "100%",
                  padding: 10,
                  background: "#25D366",
                  color: "white",
                  border: "none",
                  marginTop: 8
                }}
              >
                Buy on Amazon
              </button>

            </div>
          ))
        )}
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>

    </div>
  );
}
