import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../config/firebase";

/* ================= CATEGORY PAGE ================= */

export default function CategoryPage() {

  const router = useRouter();

  const { category } = router.query;

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [allProducts, setAllProducts] =
    useState([]);

  const [sort, setSort] =
    useState("trend");

  /* ================= LOAD ================= */

  useEffect(() => {

    if (!category) return;

    fetchProducts();

  }, [category]);

  async function fetchProducts() {

    try {

      setLoading(true);

      const snap = await getDocs(
        collection(db, "products")
      );

      const normalizedCategory =
        String(category || "")
          .toLowerCase();

      const all =
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

      setAllProducts(all);

      let filtered = all

        /* ================= FILTER ================= */
        .filter((p) =>
          (p.category || "")
            .toLowerCase()
            .includes(normalizedCategory)
        )

        /* ================= AI TREND ENGINE ================= */
        .map((p) => {

          const trendScore =

            (p.score || 0) * 3 +

            (p.clicks || 0) * 2 +

            (p.views || 0) * 1 +

            (p.orders || 0) * 5 +

            (p.rating || 0) * 20 +

            (p.viralBoost ? 80 : 0);

          return {
            ...p,
            trendScore,
          };
        })

        /* ================= SORT ================= */
        .sort((a, b) => {

          if (sort === "price_low")
            return (
              (a.price || 0) -
              (b.price || 0)
            );

          if (sort === "price_high")
            return (
              (b.price || 0) -
              (a.price || 0)
            );

          if (sort === "rating")
            return (
              (b.rating || 0) -
              (a.rating || 0)
            );

          return (
            b.trendScore -
            a.trendScore
          );
        });

      setProducts(filtered);

    } catch (err) {

      console.error(
        "Category fetch error:",
        err
      );

      setProducts([]);

    } finally {

      setLoading(false);

    }
  }

  /* ================= RELATED CATEGORIES ================= */

  const relatedCategories = [

    ...new Set(
      allProducts
        .map((p) => p.category)
        .filter(Boolean)
    ),

  ].slice(0, 8);

  /* ================= SEO ================= */

  const title =
    `${category} Products | Koloonline`;

  const description =
    `Discover trending ${category} products, viral Amazon finds, and best smart shopping deals updated daily.`;

  const url =
    `https://koloonline.online/category/${category}`;

  /* ================= SCHEMA ================= */

  const schema = {

    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    name: title,

    description,

    url,
  };

  return (

    <div
      style={{
        background: "#f3f4f6",
        minHeight: "100vh",
        padding: 20,
        fontFamily: "Arial",
      }}
    >

      {/* ================= SEO ================= */}

      <Head>

        <title>
          {title}
        </title>

        <meta
          name="description"
          content={description}
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link
          rel="canonical"
          href={url}
        />

        {/* OG */}

        <meta
          property="og:title"
          content={title}
        />

        <meta
          property="og:description"
          content={description}
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:url"
          content={url}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(schema),
          }}
        />

      </Head>

      {/* ================= HEADER ================= */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: 20,

          marginBottom: 25,
        }}
      >

        <div>

          <h1
            style={{
              fontSize: 38,
              marginBottom: 10,
            }}
          >
            📦 {category}
          </h1>

          <p
            style={{
              color: "#666",
            }}
          >
            Trending Amazon deals &
            smart product rankings
          </p>

        </div>

        {/* ================= SORT ================= */}

        <select

          value={sort}

          onChange={(e) =>
            setSort(e.target.value)
          }

          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
        >

          <option value="trend">
            Trending
          </option>

          <option value="rating">
            Top Rated
          </option>

          <option value="price_low">
            Lowest Price
          </option>

          <option value="price_high">
            Highest Price
          </option>

        </select>

      </div>

      {/* ================= RELATED ================= */}

      {relatedCategories.length > 0 && (

        <div
          style={{
            marginBottom: 30,
          }}
        >

          <h3>
            🔥 Explore Categories
          </h3>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 10,
            }}
          >

            {relatedCategories.map((c) => (

              <Link
                key={c}
                href={`/category/${c}`}
              >

                <span
                  style={{
                    padding:
                      "8px 14px",

                    background:
                      "white",

                    border:
                      "1px solid #ddd",

                    borderRadius: 30,

                    fontSize: 13,

                    cursor: "pointer",
                  }}
                >
                  {c}
                </span>

              </Link>

            ))}

          </div>

        </div>

      )}

      {/* ================= LOADING ================= */}

      {loading ? (

        <p>
          Loading products...
        </p>

      ) : products.length === 0 ? (

        <p>
          No products found.
        </p>

      ) : (

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(240px,1fr))",

            gap: 24,
          }}
        >

          {products.map((p) => (

            <Link

              key={p.id}

              href={`/product/${p.asin || p.id}`}

              style={{
                textDecoration: "none",
                color: "black",
              }}
            >

              <div
                style={{
                  background: "white",

                  borderRadius: 18,

                  overflow: "hidden",

                  boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",

                  transition: "0.3s",

                  height: "100%",
                }}
              >

                {/* IMAGE */}

                <div
                  style={{
                    padding: 20,
                    background: "#fff",
                  }}
                >

                  <Image
                    src={
                      p.image ||
                      "https://via.placeholder.com/400"
                    }

                    alt={p.title}

                    width={300}

                    height={300}

                    style={{
                      width: "100%",
                      height: 220,
                      objectFit: "contain",
                    }}
                  />

                </div>

                {/* CONTENT */}

                <div
                  style={{
                    padding: 18,
                  }}
                >

                  <h3
                    style={{
                      fontSize: 16,
                      lineHeight: 1.6,
                      height: 55,
                      overflow: "hidden",
                    }}
                  >
                    {p.title}
                  </h3>

                  <div
                    style={{
                      marginTop: 8,
                      color: "#FFA41C",
                    }}
                  >
                    ⭐ {p.rating || 4.5}
                  </div>

                  <h2
                    style={{
                      color: "#B12704",
                      marginTop: 10,
                    }}
                  >
                    ${p.price || 0}
                  </h2>

                  {/* VIRAL */}

                  {p.viralBoost && (

                    <div
                      style={{
                        marginTop: 10,
                      }}
                    >

                      <span
                        style={{
                          background:
                            "linear-gradient(45deg,#ff0000,#ff6600)",

                          color: "white",

                          padding:
                            "5px 10px",

                          borderRadius: 10,

                          fontSize: 11,

                          fontWeight: "bold",
                        }}
                      >
                        🔥 VIRAL
                      </span>

                    </div>

                  )}

                </div>

              </div>

            </Link>

          ))}

        </div>

      )}

    </div>
  );
            }
