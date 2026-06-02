import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= SMART IMAGE ================= */
import Image from "next/image";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("trend");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [visibleCount, setVisibleCount] = useState(12);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!category) return;

    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));

        const all = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const filtered = all.filter((p) =>
          p.category?.toLowerCase().includes(String(category).toLowerCase())
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

  /* ================= SORT + FILTER ================= */
  const sorted = useMemo(() => {
    return [...products]
      .filter(
        (p) =>
          (p.price || 0) >= minPrice &&
          (p.price || 0) <= maxPrice
      )
      .sort((a, b) => {
        if (sort === "price_low") return (a.price || 0) - (b.price || 0);
        if (sort === "price_high") return (b.price || 0) - (a.price || 0);
        if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sort === "views") return (b.views || 0) - (a.views || 0);
        return (b.trendScore || 0) - (a.trendScore || 0);
      });
  }, [products, sort, minPrice, maxPrice]);

  const visibleProducts = sorted.slice(0, visibleCount);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  const aiDesc = `Best ${category} products selected by AI based on trends, ratings and engagement.`;

  return (
    <div style={{ fontFamily: "Arial", padding: 20, background: "#fafafa" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>{category} | Koloonline AI Deals</title>
        <meta name="description" content={aiDesc} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`https://koloonline.online/category/${category}`} />
      </Head>

      {/* ================= HEADER ================= */}
      <h1>🔥 {category} Products</h1>
      <p style={{ color: "#555" }}>{aiDesc}</p>

      {/* ================= CONTROLS ================= */}
      <div style={{ marginTop: 20 }}>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="trend">Trending</option>
          <option value="rating">Top Rated</option>
          <option value="price_low">Lowest Price</option>
          <option value="price_high">Highest Price</option>
          <option value="views">Most Viewed</option>
        </select>

        <div style={{ marginTop: 10 }}>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ marginLeft: 10 }}
          />
        </div>
      </div>

      {/* ================= PRODUCTS GRID ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
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
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              display: "block",
            }}
          >
            {/* VIRAL BADGE */}
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

            {/* ================= IMAGE OPTIMIZED ================= */}
            <div style={{ position: "relative", width: "100%", height: 180 }}>
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                style={{ objectFit: "contain" }}
                priority={false}
              />
            </div>

            <h3>{p.title}</h3>
            <p>${p.price}</p>
            <p>⭐ {p.rating || 4.5}</p>
          </a>
        ))}
      </div>

      {/* ================= LOAD MORE ================= */}
      {visibleProducts.length < sorted.length && (
        <button
          onClick={() => setVisibleCount((p) => p + 12)}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 12,
            background: "#111",
            color: "white",
            border: "none",
            borderRadius: 8,
          }}
        >
          Load More
        </button>
      )}
    </div>
  );
        }
