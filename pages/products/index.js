import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";

import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../config/firebase";

const fallbackImage =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= STARS ================= */
function Stars({ rating = 4.5 }) {
  const full = Math.floor(Number(rating) || 0);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        marginTop: 8,
      }}
    >
      <div style={{ color: "#FFA41C" }}>{"★".repeat(full)}</div>

      <span style={{ fontSize: 13, color: "#666" }}>
        {rating}/5
      </span>
    </div>
  );
}

/* ================= PAGE ================= */
export default function ProductsPage({ products = [] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  /* ================= SAFE CATEGORIES ================= */
  const categories = useMemo(() => {
    const cats = products
      .map((p) => p.category || "general")
      .filter(Boolean);

    return ["all", ...Array.from(new Set(cats))];
  }, [products]);

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      const title = (p.title || "").toLowerCase();

      const searchMatch = title.includes(search.toLowerCase());

      const categoryMatch =
        category === "all"
          ? true
          : (p.category || "general") === category;

      return searchMatch && categoryMatch;
    });

    return filtered
      .sort((a, b) => {
        const aScore =
          (a.views || 0) +
          (a.clicks || 0) * 2 +
          (a.orders || 0) * 5;

        const bScore =
          (b.views || 0) +
          (b.clicks || 0) * 2 +
          (b.orders || 0) * 5;

        return bScore - aScore;
      })
      .slice(0, 120);
  }, [products, search, category]);

  return (
    <div
      style={{
        background: "#f4f6f9",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      <Head>
        <title>Best Amazon Products | Koloonline</title>
        <meta
          name="description"
          content="Trending Amazon products and deals"
        />
        <meta name="robots" content="index,follow" />
      </Head>

      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(45deg,#111827,#1f2937)",
          padding: "50px 20px",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1>🔥 Trending Products</h1>
      </div>

      {/* CONTAINER */}
      <div style={{ maxWidth: 1400, margin: "auto", padding: 20 }}>
        {/* FILTER */}
        <div
          style={{
            background: "white",
            padding: 20,
            borderRadius: 20,
            marginBottom: 30,
          }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 10,
              border: "1px solid #ddd",
              marginBottom: 15,
            }}
          />

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 20,
                  border: "none",
                  cursor: "pointer",
                  background:
                    category === cat ? "#111827" : "#eee",
                  color: category === cat ? "white" : "black",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
          }}
        >
          {filteredProducts.map((product) => {
            const rating = Number(product.rating || 4.5);

            return (
              <Link
                key={product.asin || product.id}
                href={`/product/${product.asin || product.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    background: "white",
                    borderRadius: 20,
                    overflow: "hidden",
                    boxShadow:
                      "0 8px 20px rgba(0,0,0,0.06)",
                  }}
                >
                  <Image
                    src={product.image || fallbackImage}
                    alt={product.title || "Product"}
                    width={300}
                    height={300}
                    style={{
                      width: "100%",
                      height: 240,
                      objectFit: "contain",
                    }}
                  />

                  <div style={{ padding: 15 }}>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#2563eb",
                      }}
                    >
                      {product.category || "Trending"}
                    </span>

                    <h3 style={{ fontSize: 15 }}>
                      {product.title || "No title"}
                    </h3>

                    <Stars rating={rating} />

                    <div
                      style={{
                        marginTop: 10,
                        fontWeight: "bold",
                        color: "#B12704",
                        fontSize: 20,
                      }}
                    >
                      ${Number(product.price || 0)}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: "center", padding: 40 }}>
            No products found
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= DATA FETCH ================= */
export async function getStaticProps() {
  try {
    const snap = await getDocs(
      query(collection(db, "products"), limit(120))
    );

    const products = snap.docs.map((d) => ({
      id: d.id,
      asin: d.id,
      ...d.data(),
    }));

    return {
      props: { products },
      revalidate: 120,
    };
  } catch (err) {
    console.error("Products error:", err);

    return {
      props: { products: [] },
      revalidate: 120,
    };
  }
            }
