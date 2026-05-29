import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";

/* ================= CONSTANTS ================= */

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x300?text=Koloonline";

/* ================= HELPERS ================= */

const getStr = (v) => (v ? String(v) : "");
const getNum = (v) => (typeof v === "number" ? v : 0);

/* ================= TREND SCORE ================= */

function trendScore(p) {
  return (
    getNum(p.views) +
    getNum(p.clicks) * 2 +
    getNum(p.orders) * 5 +
    (p.viralBoost ? 50 : 0)
  );
}

/* ================= HERO ================= */

function Hero() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
        color: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <h1 style={{ fontSize: 18, margin: 0 }}>
        🔥 Trending Amazon Deals
      </h1>

      <p style={{ fontSize: 12, color: "#cbd5e1" }}>
        AI-powered real-time ranking engine
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Link href="/products" style={{ color: "#fff" }}>
          🛒 Products
        </Link>
        <Link href="/blog" style={{ color: "#fff" }}>
          📚 Blog
        </Link>
      </div>
    </section>
  );
}

/* ================= PRODUCT CARD ================= */

function ProductCard({ p }) {
  const title = getStr(p.title) || "Product";
  const id = getStr(p.id);

  const image =
    typeof p.image === "string" && p.image.startsWith("http")
      ? p.image
      : FALLBACK_IMAGE;

  const price = getNum(p.price);

  return (
    <Link href={`/product/${id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: 8,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            style={{ objectFit: "cover" }}
            loading="lazy"
            placeholder="blur"
            blurDataURL={FALLBACK_IMAGE}
          />
        </div>

        <h3 style={{ fontSize: 12, margin: "6px 0 0 0" }}>
          {title.length > 55 ? title.slice(0, 55) + "..." : title}
        </h3>

        <p style={{ color: "#b12704", fontWeight: "bold", margin: 0 }}>
          ${price}
        </p>
      </div>
    </Link>
  );
}

/* ================= MAIN PAGE ================= */

export default function Home() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH FROM SYSTEM API ================= */
  useEffect(() => {
    async function loadTrending() {
      try {
        const res = await fetch("/api/system?action=trending");
        const data = await res.json();

        if (data?.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("API Error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadTrending();
  }, []);

  /* ================= FILTER + SORT ================= */
  const trending = useMemo(() => {
    let list = products;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        (p.title || "").toLowerCase().includes(q)
      );
    }

    list = list.slice(0, 15);

    return list
      .sort((a, b) => trendScore(b) - trendScore(a))
      .slice(0, 12);
  }, [products, search]);

  return (
    <div style={{ background: "#f5f5f5", fontFamily: "Arial" }}>
      <Head>
        <title>Koloonline</title>
        <meta name="description" content="AI Amazon Deals Engine" />
      </Head>

      {/* HEADER */}
      <header
        style={{
          background: "#fff",
          padding: 10,
          display: "flex",
          gap: 10,
          position: "sticky",
          top: 0,
          zIndex: 999,
        }}
      >
        <Link href="/" style={{ fontWeight: "bold" }}>
          🟠 Koloonline
        </Link>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />
      </header>

      {/* MAIN */}
      <main style={{ maxWidth: 1100, margin: "auto", padding: 12 }}>
        <Hero />

        <h2 style={{ fontSize: 15 }}>🔥 Trending Now</h2>

        {/* LOADING STATE */}
        {loading ? (
          <p>Loading trending products...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(140px,1fr))",
              gap: 8,
            }}
          >
            {trending.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: 25,
          background: "#111827",
          color: "#fff",
          textAlign: "center",
          padding: 12,
          fontSize: 12,
        }}
      >
        © 2026 Koloonline
      </footer>
    </div>
  );
      }
