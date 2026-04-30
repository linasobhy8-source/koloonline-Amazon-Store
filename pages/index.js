import Head from "next/head";
import { useEffect, useState, useMemo } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../firebase-config";
import Link from "next/link";
import { trackEvent } from "../lib/tracking";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), limit(50));
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
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || p.category === category;
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  /* ================= SECTIONS ================= */
  const trending = [...filtered].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 6);
  const bestSellers = [...filtered].sort((a, b) => (b.orders || 0) - (a.orders || 0)).slice(0, 6);
  const deals = [...filtered].filter((p) => p.price < 50).slice(0, 6);

  /* ================= UI ================= */
  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      <Head>
        <title>Koloonline Store - Best Deals & Trending Products</title>
        <meta name="description" content="Best Amazon Affiliate Store" />
      </Head>

      {/* HEADER */}
      <header style={{
        background: "#131921",
        color: "white",
        padding: 15,
        fontSize: 18
      }}>
        🛒 Koloonline Store
      </header>

      {/* SEARCH */}
      <div style={{ display: "flex", gap: 10, padding: 10 }}>
        <input
          placeholder="Search products..."
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

      {/* ================= SECTIONS UI ================= */}

      <Section title="🔥 Trending Now" items={trending} />
      <Section title="💰 Best Sellers" items={bestSellers} />
      <Section title="⚡ Deals Under $50" items={deals} />

    </div>
  );
}

/* ================= SECTION COMPONENT ================= */
function Section({ title, items }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>{title}</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: 15
      }}>
        {items.map((p) => (
          <div key={p.id} style={{
            background: "white",
            padding: 12,
            borderRadius: 10
          }}>

            <img
              src={p.image || "/placeholder.png"}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 8
              }}
            />

            <h3>{p.title}</h3>
            <p>${p.price}</p>

            <Link href={`/product/${p.asin}`}>
              <button
                onClick={() => trackEvent("click", p)}
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

            <button
              onClick={() => {
                trackEvent("order", p);
                window.open(p.link, "_blank");
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
              Buy Now
            </button>

          </div>
        ))}
      </div>
    </div>
  );
            }
