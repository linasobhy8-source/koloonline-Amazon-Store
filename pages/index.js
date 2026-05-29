import Head from "next/head";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

/* ================= CARD ================= */
function Card({ p }) {
  const title = p?.title || "Product";
  const price = p?.price || 0;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ fontSize: 14 }}>{title}</h3>

      <p style={{ color: "#b12704", fontWeight: "bold" }}>
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
}

/* ================= PAGE ================= */
export default function Home() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD FEED ================= */
  const loadFeed = useCallback(async (p) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/system?action=feed&page=${p}`
      );

      const data = await res.json();

      if (data?.success) {
        if (p === 1) {
          setProducts(data.data || []);
        } else {
          setProducts((prev) => [
            ...prev,
            ...(data.data || []),
          ]);
        }

        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("Feed Error:", err);
    }

    setLoading(false);
  }, [loading]);

  /* ================= INIT ================= */
  useEffect(() => {
    loadFeed(1);
  }, [loadFeed]);

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    function onScroll() {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 250
      ) {
        if (hasMore && !loading) {
          const next = page + 1;
          setPage(next);
          loadFeed(next);
        }
      }
    }

    window.addEventListener("scroll", onScroll);

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, [page, hasMore, loading, loadFeed]);

  return (
    <div style={{ background: "#f5f5f5", fontFamily: "Arial" }}>
      <Head>
        <title>Koloonline AI Feed</title>
        <meta
          name="description"
          content="TikTok style AI shopping feed"
        />
      </Head>

      {/* HEADER */}
      <div
        style={{
          padding: 10,
          background: "#111827",
          color: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 999,
        }}
      >
        <h2 style={{ margin: 0 }}>🔥 TikTok AI Feed</h2>
      </div>

      {/* FEED */}
      <div style={{ padding: 10 }}>
        {products.map((p) => (
          <Card key={p.id} p={p} />
        ))}

        {loading && (
          <p style={{ textAlign: "center" }}>Loading...</p>
        )}

        {!hasMore && (
          <p style={{ textAlign: "center" }}>
            No more products
          </p>
        )}
      </div>
    </div>
  );
    }
