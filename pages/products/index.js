import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { fetchProducts } from "../../lib/fetchProducts";

const fallbackImage = "https://via.placeholder.com/500x500?text=Product";

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

  if (typeof v === "object") {
    if (typeof v.text === "string") return v.text;
    if (typeof v.title === "string") return v.title;
    if (typeof v.value === "string") return v.value;
    return "";
  }

  return "";
};

/* ================= SAFE IMAGE ================= */
const safeImage = (img) => {
  try {
    if (typeof img === "string" && img.startsWith("http")) {
      return img;
    }

    if (img && typeof img === "object") {
      if (typeof img.url === "string") return img.url;
      if (typeof img.image === "string") return img.image;
    }

    return fallbackImage;
  } catch {
    return fallbackImage;
  }
};

/* ================= PAGE ================= */
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchProducts()
      .then((data) => {
        if (!mounted) return;

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch(() => {
        if (mounted) setProducts([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
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
        <title>Products | Koloonline</title>
        <meta
          name="description"
          content="Browse trending products and deals"
        />
      </Head>

      <h1>🔥 Trending Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {filtered.map((p, index) => {
          const id = safeText(p?.id);
          const title = safeText(p?.title);
          const image = safeImage(p?.image);

          if (!id) return null;

          return (
            <Link key={id} href={`/product/${id}`}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  padding: 10,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <Image
                  src={image || fallbackImage}
                  width={300}
                  height={300}
                  alt={title || "product"}
                  loading={index < 4 ? "eager" : "lazy"}
                  priority={index < 4}
                  style={{ objectFit: "contain" }}
                />

                <h3 style={{ fontSize: 14 }}>
                  {title || "Untitled"}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
            }
