import Head from "next/head";
import { useEffect, useState, useCallback, memo } from "react";
import Link from "next/link";

const Card = memo(({ p }) => (
  <div
    style={{
      background: "#fff",
      padding: 12,
      marginBottom: 12,
      borderRadius: 12,
      contain: "content",
    }}
  >
    <h3>{p.title}</h3>
    <p style={{ color: "#b12704" }}>${p.price}</p>

    <Link href={`/product/${p.id}`}>
      <button style={{ width: "100%", padding: 10 }}>
        View
      </button>
    </Link>
  </div>
));

export default function Home() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(async (p) => {
    if (loading) return;
    setLoading(true);

    const res = await fetch(`/api/system?action=feed&page=${p}`);
    const data = await res.json();

    if (data.success) {
      setProducts((prev) =>
        p === 1 ? data.data : [...prev, ...data.data]
      );
      setHasMore(data.hasMore);
    }

    setLoading(false);
  }, [loading]);

  useEffect(() => {
    load(1);
  }, []);

  useEffect(() => {
    const el = document.getElementById("load");

    const obs = new IntersectionObserver((e) => {
      if (e[0].isIntersecting && hasMore && !loading) {
        const next = page + 1;
        setPage(next);
        load(next);
      }
    });

    if (el) obs.observe(el);

    return () => obs.disconnect();
  }, [page, hasMore, loading]);

  return (
    <div>
      <Head>
        <title>Koloonline Feed</title>
      </Head>

      {products.map((p) => (
        <Card key={p.id} p={p} />
      ))}

      <div id="load" style={{ height: 20 }} />

      {loading && <p>Loading...</p>}
    </div>
  );
}
