import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackImage = "https://via.placeholder.com/300";

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setProducts(data);
      } catch (e) {
        console.log("Error loading products:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>All Products | Koloonline</title>

        <meta
          name="description"
          content="Browse all Amazon products, trending deals, and best offers on Koloonline."
        />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href="https://koloonline.online/products" />
      </Head>

      <h1>📦 All Products</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 15,
            marginTop: 20,
          }}
        >
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`}>
              <div
                style={{
                  background: "white",
                  padding: 10,
                  borderRadius: 10,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <img
                  src={p.image || fallbackImage}
                  alt={p.title}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />

                <h4 style={{ marginTop: 10 }}>{p.title}</h4>

                <p style={{ color: "red", fontWeight: "bold" }}>
                  ${p.price || "0"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
        }
