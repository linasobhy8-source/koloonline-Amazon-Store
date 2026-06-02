import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const snap = await getDocs(collection(db, "products"));

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setProducts(data);
      } catch (error) {
        console.error("Products load error:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <Head>
        <title>All Products | Koloonline Deals</title>

        <meta
          name="description"
          content="Browse trending Amazon products, deals and offers updated daily."
        />

        <meta name="robots" content="index,follow" />

        <link
          rel="canonical"
          href="https://koloonline.online/products"
        />
      </Head>

      <h1>🔥 All Products</h1>

      {loading && <p>Loading...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 15,
        }}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 10,
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              <Image
                src={p.image || "https://via.placeholder.com/300"}
                width={300}
                height={300}
                alt={p.title || "Product"}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />

              <h3>{p.title}</h3>

              <p
                style={{
                  color: "#B12704",
                }}
              >
                ${p.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
  }
