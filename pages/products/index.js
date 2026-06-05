import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";

import { optimizeAmazonImage } from "../../lib/amazonImage";
import { getProductsFast } from "../../lib/firebaseQuery";

/* ================= FALLBACK ================= */
const fallbackImage =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= STARS ================= */
function Stars({ rating = 4.5 }) {
  const full = Math.floor(Number(rating) || 0);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
      <div style={{ color: "#FFA41C" }}>{"★".repeat(full)}</div>
      <span style={{ fontSize: 13, color: "#666" }}>{rating}/5</span>
    </div>
  );
}

/* ================= PAGE ================= */
export default function ProductsPage({ products = [] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  /* ================= CATEGORIES ================= */
  const categories = useMemo(() => {
    const cats = products
      .map((p) => p.category || "general")
      .filter(Boolean);

    return ["all", ...Array.from(new Set(cats))];
  }, [products]);

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    return (products || [])
      .filter((p) => {
        const title = (p.title || "").toLowerCase();

        const searchMatch = title.includes(search.toLowerCase());

        const categoryMatch =
          category === "all"
            ? true
            : (p.category || "general") === category;

        return searchMatch && categoryMatch;
      })
      .slice(0, 120);
  }, [products, search, category]);

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      <Head>
        <title>Products | Koloonline</title>
      </Head>

      <div style={{ padding: 20 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          style={{ padding: 10, width: "100%", marginBottom: 20 }}
        />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: 8,
                background: category === cat ? "#111" : "#eee",
                color: category === cat ? "#fff" : "#000",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: 15,
          padding: 20,
        }}
      >
        {filteredProducts.map((product) => {
          const imageSrc =
            optimizeAmazonImage(product.image) || fallbackImage;

          return (
            <Link
              key={product.asin || product.id}
              href={`/product/${product.asin || product.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: 10,
                  borderRadius: 12,
                }}
              >
                <Image
                  src={imageSrc}
                  alt={product.title || "product"}
                  width={300}
                  height={300}
                  style={{
                    width: "100%",
                    height: 260,
                    objectFit: "contain",
                  }}
                />

                <h3>{product.title}</h3>

                <Stars rating={product.rating || 4.5} />

                <p style={{ color: "#B12704", fontWeight: "bold" }}>
                  ${product.price || 0}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ================= STATIC PROPS (FIXED) ================= */
export async function getStaticProps() {
  try {
    const products = await getProductsFast(); // ✅ مهم جدًا (await)

    return {
      props: {
        products: products || [],
      },
      revalidate: 120,
    };
  } catch (err) {
    return {
      props: {
        products: [],
      },
      revalidate: 120,
    };
  }
}
