import Head from "next/head";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  /* ================= FILTER ================= */
  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

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
        gap: 15
      }}>
        
        <img
          src="https://i.postimg.cc/9fVfC1Y4/1000276862.png"
          alt="Koloonline Logo"
          style={{ height: 45 }}
        />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 5,
            border: "none",
            outline: "none"
          }}
        />

      </header>

      {/* ================= NAV ================= */}
      <nav style={{
        background: "#232f3e",
        padding: 10,
        color: "white"
      }}>
        <Link href="/">Home</Link>
      </nav>

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
                  alt={p.title}
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

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
