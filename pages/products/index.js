import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { fetchProducts } from "../../lib/fetchProducts";
import { optimizeAmazonImage } from "../../lib/amazonImage";

const fallbackImage = "https://via.placeholder.com/500x500";

/* ================= SAFE TEXT ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (v && typeof v.toDate === "function") {
    try {
      return v.toDate().toISOString();
    } catch {
      return "";
    }
  }

  return "";
};

/* ================= SAFE IMAGE ================= */
const safeImage = (img) => {
  try {
    if (typeof img !== "string") return fallbackImage;

    const optimized = optimizeAmazonImage(img);

    if (typeof optimized !== "string" || !optimized.startsWith("http")) {
      return fallbackImage;
    }

    return optimized;
  } catch {
    return fallbackImage;
  }
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return (products || []).slice(0, 40);
  }, [products]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 10,
          padding: 20,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 250,
              background: "#eee",
              borderRadius: 10,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Products</title>
        <meta name="description" content="Trending products" />
      </Head>

      <h1>Trending Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 20,
        }}
      >
        {filtered.map((p) => {
          const id = safeText(p?.id);
          const title = safeText(p?.title);

          if (!id) return null;

          return (
            <Link key={id} href={`/product/${id}`}>
              <div>
                <Image
                  src={safeImage(p?.image)}
                  width={300}
                  height={300}
                  alt={title || "Product"}
                  loading="lazy"
                  style={{ objectFit: "contain" }}
                />

                <h3>{title}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
          }
