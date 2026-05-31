import Head from "next/head";
import { useEffect, useState, useCallback, memo } from "react";
import Link from "next/link";

/* ================= CARD ================= */
const Card = memo(function Card({ p }) {
  const title = p?.title || "Product";
  const price = p?.price || 0;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        contain: "content",
      }}
    >
      <h3
        style={{
          fontSize: 14,
          marginBottom: 8,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#b12704",
          fontWeight: "bold",
        }}
      >
        ${price}
      </p>

      <Link href={`/product/${p.id}`}>
        <button
          style={{
            width: "100%",
            padding: 10,
            background: "#ff9900",
            border: 0,
            color: "#fff",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          View Product
        </button>
      </Link>
    </div>
  );
});

/* ================= PAGE ================= */
export default function Home() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD FEED ================= */
  const loadFeed = useCallback(
    async (currentPage) => {
      if (loading) return;

      setLoading(true);

      try {
        const res = await fetch(
          `/api/system?action=feed&page=${currentPage}`
        );

        const data = await res.json();

        if (data?.success) {
          setProducts((prev) =>
            currentPage === 1
              ? data.data || []
              : [...prev, ...(data.data || [])]
          );

          setHasMore(Boolean(data.hasMore));
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    },
    [loading]
  );

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    loadFeed(1);
  }, [loadFeed]);

  /* ================= INTERSECTION OBSERVER ================= */
  useEffect(() => {
    const target = document.getElementById("feed-loader");

    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (
          first.isIntersecting &&
          hasMore &&
          !loading
        ) {
          const nextPage = page + 1;

          setPage(nextPage);
          loadFeed(nextPage);
        }
      },
      {
        rootMargin: "300px",
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [page, hasMore, loading, loadFeed]);

  return (
    <div
      style={{
        background: "#f5f5f5",
        fontFamily: "Arial",
        minHeight: "100vh",
      }}
    >
      <Head>
        <title>
          Koloonline AI Feed | Viral Products
        </title>

        <meta
          name="description"
          content="Discover trending Amazon products with the Koloonline AI Feed."
        />

        <meta
          property="og:title"
          content="Koloonline AI Feed"
        />

        <meta
          property="og:description"
          content="Trending Amazon products updated automatically."
        />

        <meta
          property="og:type"
          content="website"
        />

        <link
          rel="canonical"
          href="https://koloonline.online"
        />
      </Head>

      {/* HEADER */}
      <div
        style={{
          padding: 12,
          background: "#111827",
          color: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 999,
        }}
      >
        <h2 style={{ margin: 0 }}>
          🔥 TikTok AI Feed
        </h2>
      </div>

      {/* FEED */}
      <div
        style={{
          maxWidth: 900,
          margin: "auto",
          padding: 10,
        }}
      >
        {products.map((p) => (
          <Card key={p.id} p={p} />
        ))}

        {loading && (
          <p style={{ textAlign: "center" }}>
            Loading...
          </p>
        )}

        <div
          id="feed-loader"
          style={{
            height: 20,
          }}
        />

        {!hasMore && (
          <p
            style={{
              textAlign: "center",
              color: "#666",
            }}
          >
            No more products
          </p>
        )}
      </div>
    </div>
  );
  }
