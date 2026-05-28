import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useCallback } from "react";

/* ================= SAFE ================= */

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x300?text=Koloonline";

function safeString(value, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function safeNumber(value, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

/* ================= HERO ================= */

function Hero() {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
        color: "white",
        padding: 28,
        borderRadius: 16,
        marginBottom: 20,
        contain: "layout paint",
      }}
    >
      <h1 style={{ fontSize: 20 }}>
        🔥 Viral Amazon Deals
      </h1>

      <p style={{ color: "#cbd5e1", fontSize: 13 }}>
        Fast trending products powered by AI
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
        <Link href="/products">🛒 Products</Link>
        <Link href="/blog">📚 Blog</Link>
      </div>
    </section>
  );
}

/* ================= PRODUCT CARD (OPTIMIZED CLS + INP) ================= */

function ProductCard({ product }) {
  const title = safeString(product?.title, "Product");
  const image = product?.image?.startsWith("http")
    ? product.image
    : FALLBACK_IMAGE;

  const price = safeNumber(product?.price);
  const id = safeString(product?.id);

  return (
    <Link
      href={`/product/${id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        willChange: "transform",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 10,
          contain: "content",
        }}
      >
        {/* IMAGE FIX CLS 100% */}
        <div
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            position: "relative",
            overflow: "hidden",
            borderRadius: 10,
          }}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            style={{
              objectFit: "cover",
            }}
            loading="lazy"
          />
        </div>

        <h3
          style={{
            fontSize: 12,
            marginTop: 8,
            minHeight: 32,
          }}
        >
          {title.length > 55 ? title.slice(0, 55) + "..." : title}
        </h3>

        <p style={{ color: "#b12704", fontWeight: "bold" }}>
          ${price}
        </p>
      </div>
    </Link>
  );
}

/* ================= PAGE ================= */

export default function Home({ products = [] }) {
  const [search, setSearch] = useState("");

  /* ================= FAST FILTER (NO HEAVY OPS) ================= */
  const trendingProducts = useMemo(() => {
    let list = products;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        (p?.title || "").toLowerCase().includes(q)
      );
    }

    // ❌ removed expensive sorting completely
    return list.slice(0, 12);
  }, [products, search]);

  const onSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Head>
        <title>Koloonline</title>
        <meta name="description" content="Best Amazon Deals" />
      </Head>

      {/* HEADER */}
      <header
        style={{
          background: "white",
          padding: 10,
          display: "flex",
          gap: 10,
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Link href="/" style={{ fontWeight: "bold" }}>
          🟠 Koloonline
        </Link>

        <input
          placeholder="Search..."
          value={search}
          onChange={onSearch}
          style={{
            padding: 8,
            borderRadius: 8,
            width: "100%",
            border: "1px solid #ddd",
          }}
        />
      </header>

      {/* MAIN */}
      <main
        style={{
          maxWidth: 1100,
          margin: "auto",
          padding: 15,
        }}
      >
        <Hero />

        <h2 style={{ fontSize: 18 }}>🔥 Trending</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(140px,1fr))",
            gap: 10,
          }}
        >
          {trendingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: 40,
          background: "#111827",
          color: "white",
          padding: 20,
          textAlign: "center",
        }}
      >
        © 2026 Koloonline
      </footer>
    </div>
  );
}

/* ================= DATA (OPTIMIZED ISR) ================= */

export async function getStaticProps() {
  try {
    const snap = await getDocs(
      query(collection(db, "products"), limit(20))
    );

    const products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      props: { products },
      revalidate: 600, // 🔥 زودنا cache لتحسين RES
    };
  } catch (error) {
    return {
      props: { products: [] },
      revalidate: 600,
    };
  }
}
