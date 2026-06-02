import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= FALLBACK IMAGE ================= */
const fallbackImage = "https://via.placeholder.com/300x300?text=Koloonline";

/* ================= IMAGE OPTIMIZER (CDN READY HOOK) ================= */
function optimizeImage(src) {
  if (!src) return fallbackImage;

  // Amazon fix (CDN friendly)
  if (src.includes("amazon")) {
    return src.replace("http://", "https://");
  }

  return src;
}

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
    <div style={{ fontFamily: "Arial", padding: 20, background: "#fafafa" }}>
      
      {/* ================= SEO ================= */}
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

      {/* ================= GRID ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 15,
          marginTop: 20,
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
                borderRadius: 12,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "0.2s",
              }}
            >
              {/* ================= IMAGE OPTIMIZED ================= */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 220,
                  background: "#fff",
                }}
              >
                <Image
                  src={optimizeImage(p.image)}
                  alt={p.title || "Product"}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{
                    objectFit: "contain",
                  }}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={fallbackImage}
                />
              </div>

              {/* ================= TITLE ================= */}
              <h3 style={{ fontSize: 14, marginTop: 10 }}>
                {p.title}
              </h3>

              {/* ================= PRICE ================= */}
              <p style={{ color: "#B12704", fontWeight: "bold" }}>
                ${p.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
