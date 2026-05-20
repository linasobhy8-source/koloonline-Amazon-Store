import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";

import {
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";

import { db } from "../config/firebase";

const fallbackImage =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= STARS ================= */
function Stars({ rating = 4.5 }) {
  const full = Math.floor(rating);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        marginTop: 8,
      }}
    >
      <div style={{ color: "#FFA41C" }}>
        {"★".repeat(full)}
      </div>

      <span
        style={{
          fontSize: 13,
          color: "#666",
        }}
      >
        {rating}/5
      </span>
    </div>
  );
}

/* ================= PAGE ================= */
export default function ProductsPage({
  products,
}) {

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("all");

  /* ================= CATEGORIES ================= */
  const categories = [
    "all",
    ...new Set(
      products.map(
        (p) =>
          p.category || "general"
      )
    ),
  ];

  /* ================= FILTER ================= */
  const filteredProducts =
    useMemo(() => {

      return products
        .filter((p) => {

          const searchMatch =
            p.title
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const categoryMatch =
            category === "all"
              ? true
              : p.category ===
                category;

          return (
            searchMatch &&
            categoryMatch
          );
        })

        .sort(
          (a, b) =>
            (b.views || 0) +
            (b.clicks || 0) * 2 -
            ((a.views || 0) +
              (a.clicks || 0) * 2)
        );

    }, [
      products,
      search,
      category,
    ]);

  return (
    <div
      style={{
        background: "#f4f6f9",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >

      {/* ================= SEO ================= */}
      <Head>

        <title>
          Best Amazon Products 2026 |
          Koloonline
        </title>

        <meta
          name="description"
          content="Explore trending Amazon products, best deals, smart gadgets, viral products, and top shopping recommendations."
        />

        <meta
          name="robots"
          content="index,follow"
        />

        <meta
          property="og:title"
          content="Best Amazon Products"
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:url"
          content="https://koloonline.online/products"
        />

      </Head>

      {/* ================= HEADER ================= */}
      <div
        style={{
          background:
            "linear-gradient(45deg,#111827,#1f2937)",
          padding: "50px 20px",
          color: "white",
          textAlign: "center",
        }}
      >

        <h1
          style={{
            fontSize: 42,
            marginBottom: 15,
          }}
        >
          🔥 Trending Products
        </h1>

        <p
          style={{
            maxWidth: 700,
            margin: "auto",
            lineHeight: 1.8,
            color: "#ddd",
          }}
        >
          Discover the best Amazon
          deals, trending gadgets,
          viral products, and smart
          shopping recommendations.
        </p>

      </div>

      {/* ================= CONTAINER ================= */}
      <div
        style={{
          maxWidth: 1400,
          margin: "auto",
          padding: 20,
        }}
      >

        {/* ================= FILTER BAR ================= */}
        <div
          style={{
            background: "white",
            padding: 20,
            borderRadius: 20,
            marginBottom: 30,
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.06)",
          }}
        >

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 12,
              border:
                "1px solid #ddd",
              fontSize: 16,
              marginBottom: 15,
            }}
          />

          {/* CATEGORIES */}
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
                onClick={() =>
                  setCategory(cat)
                }
                style={{
                  padding:
                    "10px 18px",
                  borderRadius: 30,
                  border: "none",
                  cursor: "pointer",

                  background:
                    category === cat
                      ? "#111827"
                      : "#eef2f7",

                  color:
                    category === cat
                      ? "white"
                      : "#333",

                  fontWeight:
                    "bold",
                }}
              >
                {cat}
              </button>

            ))}

          </div>
        </div>

        {/* ================= PRODUCTS GRID ================= */}
        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",

            gap: 25,
          }}
        >

          {filteredProducts.map(
            (product) => {

              const rating =
                Number(
                  product.rating ||
                    4.5
                );

              return (
                <Link
                  key={
                    product.asin
                  }

                  href={`/product/${product.asin}`}

                  style={{
                    textDecoration:
                      "none",

                    color: "black",
                  }}
                >

                  <div
                    style={{
                      background:
                        "white",

                      borderRadius: 22,

                      overflow:
                        "hidden",

                      boxShadow:
                        "0 8px 30px rgba(0,0,0,0.06)",

                      transition:
                        "0.3s",

                      height: "100%",
                    }}
                  >

                    {/* IMAGE */}
                    <div
                      style={{
                        background:
                          "#fafafa",

                        padding: 20,

                        textAlign:
                          "center",
                      }}
                    >

                      <Image
                        src={
                          product.image ||
                          fallbackImage
                        }

                        alt={
                          product.title
                        }

                        width={300}
                        height={300}

                        style={{
                          width: "100%",

                          height: 240,

                          objectFit:
                            "contain",
                        }}
                      />

                    </div>

                    {/* CONTENT */}
                    <div
                      style={{
                        padding: 18,
                      }}
                    >

                      {/* CATEGORY */}
                      <span
                        style={{
                          background:
                            "#eef3ff",

                          color:
                            "#2563eb",

                          padding:
                            "5px 12px",

                          borderRadius:
                            20,

                          fontSize: 12,

                          fontWeight:
                            "bold",
                        }}
                      >
                        {product.category ||
                          "Trending"}
                      </span>

                      {/* TITLE */}
                      <h3
                        style={{
                          marginTop: 15,

                          lineHeight: 1.6,

                          fontSize: 16,

                          minHeight: 70,
                        }}
                      >
                        {
                          product.title
                        }
                      </h3>

                      {/* STARS */}
                      <Stars
                        rating={
                          rating
                        }
                      />

                      {/* PRICE */}
                      <div
                        style={{
                          marginTop: 18,

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "space-between",
                        }}
                      >

                        <div
                          style={{
                            color:
                              "#B12704",

                            fontWeight:
                              "bold",

                            fontSize: 24,
                          }}
                        >
                          $
                          {Number(
                            product.price ||
                              0
                          )}
                        </div>

                        {/* VIRAL */}
                        {product.viralBoost && (
                          <span
                            style={{
                              background:
                                "#dc2626",

                              color:
                                "white",

                              padding:
                                "6px 10px",

                              borderRadius:
                                12,

                              fontSize: 11,

                              fontWeight:
                                "bold",
                            }}
                          >
                            🔥 Viral
                          </span>
                        )}

                      </div>

                      {/* BUTTON */}
                      <button
                        style={{
                          width:
                            "100%",

                          marginTop: 20,

                          padding: 14,

                          border:
                            "none",

                          borderRadius:
                            12,

                          background:
                            "linear-gradient(45deg,#ff9900,#ffb84d)",

                          color:
                            "white",

                          fontWeight:
                            "bold",

                          cursor:
                            "pointer",

                          fontSize: 15,
                        }}
                      >
                        View Product
                      </button>

                    </div>
                  </div>
                </Link>
              );
            }
          )}

        </div>

        {/* ================= EMPTY ================= */}
        {filteredProducts.length ===
          0 && (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              color: "#666",
            }}
          >
            No products found.
          </div>
        )}

      </div>
    </div>
  );
}

/* ================= DATA ================= */
export async function getStaticProps() {

  const snap = await getDocs(
    query(
      collection(
        db,
        "products"
      ),
      limit(120)
    )
  );

  return {
    props: {

      products:
        snap.docs.map((d) => ({
          asin: d.id,
          ...d.data(),
        })),

    },

    revalidate: 60,
  };
        }
