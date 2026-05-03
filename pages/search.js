import Head from "next/head";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [suggestions, setSuggestions] = useState([]);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= SEARCH SUGGESTIONS ================= */
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    const results = products
      .filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5);

    setSuggestions(results);
  }, [search, products]);

  /* ================= FILTER ================= */
  const filtered = products.filter((p) => {
    const title = p.title?.toLowerCase() || "";
    const cat = p.category?.toLowerCase() || "";

    const searchMatch = title.includes(search.toLowerCase());
    const categoryMatch =
      category === "all" ? true : cat === category.toLowerCase();

    return searchMatch && categoryMatch;
  });

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>Koloonline Amazon Store</title>
        <meta name="description" content="Best Amazon Affiliate Store" />
      </Head>

      {/* ================= HEADER ================= */}
      <header style={{
        background: "#131921",
        color: "white",
        padding: 15,
        display: "flex",
        alignItems: "center",
        gap: 15,
        position: "relative"
      }}>
        
        <img
          src="https://i.postimg.cc/9fVfC1Y4/1000276862.png"
          style={{ height: 45 }}
        />

        {/* SEARCH BOX */}
        <div style={{ flex: 1, position: "relative" }}>

          <input
            type="text"
            placeholder="Search Amazon products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 5,
              border: "none"
            }}
          />

          {/* SUGGESTIONS */}
          {suggestions.length > 0 && (
            <div style={{
              position: "absolute",
              top: 45,
              left: 0,
              right: 0,
              background: "white",
              color: "black",
              borderRadius: 8,
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              zIndex: 999
            }}>
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSearch("");
                    window.location.href = `/product/${s.asin}`;
                  }}
                  style={{
                    padding: 10,
                    borderBottom: "1px solid #eee",
                    cursor: "pointer"
                  }}
                >
                  {s.title}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 5,
            border: "none"
          }}
        >
          <option value="all">All</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home</option>
        </select>

      </header>

      {/* ================= CONTENT ================= */}
      <div style={{ padding: 20 }}>

        {loading ? (
          <p>Loading products...</p>
        ) : filtered.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 15
          }}>
            {filtered.map((p) => (
              <div key={p.id} style={{
                background: "white",
                padding: 12,
                borderRadius: 10
              }}>
                
                <img
                  src={p.image}
                  style={{ width: "100%", height: 180, objectFit: "cover" }}
                />

                <h3>{p.title}</h3>
                <p>${p.price}</p>

                <Link href={`/product/${p.asin}`}>
                  <button style={{
                    width: "100%",
                    padding: 10,
                    background: "#ff9900",
                    border: "none",
                    marginTop: 8
                  }}>
                    View Product
                  </button>
                </Link>

                <button
                  onClick={() => window.open(p.link, "_blank")}
                  style={{
                    width: "100%",
                    padding: 10,
                    background: "#25D366",
                    border: "none",
                    marginTop: 8,
                    color: "white"
                  }}
                >
                  🛒 Buy on Amazon
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
