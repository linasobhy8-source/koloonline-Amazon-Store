import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../config/firebase";

/* ================= CATEGORY PAGE ================= */

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= SORT STATE ================= */
  const [sort, setSort] = useState("trend");

  /* ================= LOAD DATA ================= */
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
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [category]);

  /* ================= SORT LOGIC ================= */
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sort === "price_low")
        return (a.price || 0) - (b.price || 0);

      if (sort === "price_high")
        return (b.price || 0) - (a.price || 0);

      if (sort === "rating")
        return (b.rating || 0) - (a.rating || 0);

      /* default = trending */
      return (
        (b.trendScore || 0) -
        (a.trendScore || 0)
      );
    });
  }, [products, sort]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <p style={{ padding: 20 }}>
        Loading category...
      </p>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
        padding: 20,
      }}
    >
      {/* ================= SEO ================= */}
      <Head>
        <title>
          {category} Products | Koloonline
        </title>

        <meta
          name="description"
          content={`Best ${category} Amazon deals and trending products`}
        />

        <meta name="robots" content="index, follow" />
      </Head>

      {/* ================= HEADER ================= */}
      <h1>
        🔥 {category} Products
      </h1>

      <p>
        Discover trending {category} products,
        best prices and AI-ranked deals.
      </p>

      {/* ================= SORT DROPDOWN ================= */}
      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          style={{
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 14,
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

      {/* ================= GRID ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
        }}
      >
        {sortedProducts.map((p) => (
          <a
            key={p.id}
            href={`/product/${p.id}`}
            style={{
              background: "white",
              padding: 15,
              borderRadius: 12,
              textDecoration: "none",
              color: "black",
              boxShadow:
                "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={p.image}
              style={{
                width: "100%",
                height: 160,
                objectFit: "contain",
              }}
            />

            <h3
              style={{
                fontSize: 16,
                marginTop: 10,
              }}
            >
              {p.title}
            </h3>

            <p
              style={{
                color: "#B12704",
                fontWeight: "bold",
              }}
            >
              ${p.price || 0}
            </p>

            <p style={{ fontSize: 13 }}>
              ⭐ {p.rating || 4.5}/5
            </p>
          </a>
        ))}
      </div>
    </div>
  );
    }
