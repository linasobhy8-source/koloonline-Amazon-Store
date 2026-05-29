import Head from "next/head";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ================= CARD ================= */
function Card({ p }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
      }}
    >
      <h3 style={{ fontSize: 14 }}>{p.title}</h3>
      <p style={{ color: "#b12704" }}>${p.price}</p>

      <Link href={`/product/${p.id}`}>
        <button
          style={{
            width: "100%",
            padding: 10,
            background: "#ff9900",
            border: 0,
            color: "#fff",
            borderRadius: 6,
          }}
        >
          View
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

  /* ================= LOAD ================= */
  async function loadFeed(p) {
    if (loading) return;
    setLoading(true);

    const res = await fetch(`/api/system?action=feed&page=${p}`);
    const data = await res.json();

    if (data.success) {
      if (p === 1) {
        setProducts(data.data);
      } else {
        setProducts((prev) => [...prev, ...data.data]);
      }

      setHasMore(data.hasMore);
    }

    setLoading(false);
  }

  /* ================= INIT ================= */
  useEffect(() => {
    loadFeed(1);
  }, []);

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    function onScroll() {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        if (hasMore && !loading) {
          const next = page + 1;
          setPage(next);
          loadFeed(next);
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, hasMore, loading]);

  return (
    <div style={{ background: "#f5f5f5", fontFamily: "Arial" }}>
      <Head>
        <title>Koloonline AI Feed</title>
      </Head>

      <div style={{ padding: 10 }}>
        <h2>🔥 TikTok AI Feed</h2>

        {products.map((p) => (
          <Card key={p.id} p={p} />
        ))}

        {loading && <p>Loading...</p>}
        {!hasMore && <p>No more products</p>}
      </div>
    </div>
  );
          }
