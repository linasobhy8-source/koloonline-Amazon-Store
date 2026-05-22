import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";

/* ================= FIXED IMPORT ================= */
import { db } from "../config/firebase";

/* ================= CATEGORY PAGE ================= */

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= STATE ================= */
  const [sort, setSort] = useState("trend");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [visibleCount, setVisibleCount] = useState(12);

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!category) return;

    const load = async () => {
      try {
        const snap = await getDocs(
          collection(db, "products")
        );

        const all = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const filtered = all.filter((p) =>
          p.category
            ?.toLowerCase()
            .includes(
              String(category).toLowerCase()
            )
        );

        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [category]);

  /* ================= SORT ================= */
  const sorted = useMemo(() => {
    return [...products]
      .filter(
        (p) =>
          (p.price || 0) >= minPrice &&
          (p.price || 0) <= maxPrice
      )
      .sort((a, b) => {
        if (sort === "price_low") {
          return (a.price || 0) - (b.price || 0);
        }

        if (sort === "price_high") {
          return (b.price || 0) - (a.price || 0);
        }

        if (sort === "rating") {
          return (b.rating || 0) - (a.rating || 0);
        }

        if (sort === "views") {
          return (b.views || 0) - (a.views || 0);
        }

        return (
          (b.trendScore || 0) -
          (a.trendScore || 0)
        );
      });
  }, [products, sort, minPrice, maxPrice]);

  const visibleProducts = sorted.slice(
    0,
    visibleCount
  );

  if (loading) {
    return (
      <p style={{ padding: 20 }}>
        Loading...
      </p>
    );
  }

  const aiDesc = `Best ${category} products selected by AI based on trends, ratings and user engagement.`;

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: 20,
      }}
    >
      {/* ================= SEO ================= */}
      <Head>
        <title>
          {category} | Koloonline AI Deals
        </title>

        <meta
          name="description"
          content={aiDesc}
        />
      </Head>

      {/* ================= HEADER ================= */}
      <h1>
        🔥 {category} Products
      </h1>

      <p style={{ color: "#555" }}>
        {aiDesc}
      </p>

      {/* ================= CONTROLS ================= */}
      <div style={{ marginTop: 20 }}>
        {/* SORT */}
        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
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

          <option value="views">
            Most Viewed
          </option>
        </select>

        {/* PRICE FILTER */}
        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Min Price"
            type="number"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(
                Number(e.target.value)
              )
            }
          />

          <input
            placeholder="Max Price"
            type="number"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(
                Number(e.target.value)
              )
            }
            style={{ marginLeft: 10 }}
          />
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {visibleProducts.map((p) => (
          <a
            key={p.id}
            href={`/product/${p.id}`}
            style={{
              textDecoration: "none",
              color: "black",
              background: "white",
              padding: 15,
              borderRadius: 10,
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {/* VIRAL */}
            {p.views > 300 && (
              <span
                style={{
                  background: "red",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: 20,
                  fontSize: 12,
                }}
              >
                🔥 Viral
              </span>
            )}

            <img
              src={p.image}
              alt={p.title}
              style={{
                width: "100%",
                height: 150,
                objectFit: "contain",
                marginTop: 10,
              }}
            />

            <h3>{p.title}</h3>

            <p>${p.price}</p>

            <p>
              ⭐ {p.rating || 4.5}
            </p>
          </a>
        ))}
      </div>

      {/* ================= LOAD MORE ================= */}
      {visibleProducts.length <
        sorted.length && (
        <button
          onClick={() =>
            setVisibleCount(
              (p) => p + 12
            )
          }
          style={{
            marginTop: 20,
            width: "100%",
            padding: 12,
            background: "#111",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Load More
        </button>
      )}
    </div>
  );
              }
