import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= TREND SCORE ================= */
function calculateTrendScore(p) {
  return (
    (p.views || 0) +
    (p.clicks || 0) * 2 +
    (p.orders || 0) * 5 +
    (p.viralBoost ? 50 : 0)
  );
}

/* ================= HERO ================= */
function Hero() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
        color: "white",
        padding: 60,
        borderRadius: 20,
        marginBottom: 20,
      }}
    >
      <h1>🔥 Discover Viral Amazon Deals</h1>
      <p style={{ color: "#cbd5e1" }}>AI-powered trending products</p>

      <div style={{ display: "flex", gap: 10 }}>
        <Link href="/products">🛒 Products</Link>
        <Link href="/blog">📚 Blog</Link>
      </div>
    </section>
  );
}

/* ================= PRODUCT CARD ================= */
function ProductCard({ product }) {
  const safeTitle = typeof product.title === "string" ? product.title : "";

  return (
    <Link href={`/product/${product.id}`}>
      <div
        style={{
          background: "white",
          padding: 15,
          borderRadius: 16,
        }}
      >
        <Image
          src={product.image || "https://via.placeholder.com/300"}
          width={250}
          height={250}
          alt={safeTitle}
          loading="lazy"
        />

        <h3 style={{ fontSize: 14 }}>
          {safeTitle.slice(0, 60)}
        </h3>

        <p style={{ color: "#b12704" }}>
          ${product.price || 0}
        </p>
      </div>
    </Link>
  );
}

/* ================= PAGE ================= */
export default function Home({ products = [] }) {
  const [search, setSearch] = useState("");

  const trendingProducts = useMemo(() => {
    const filtered = search
      ? products.filter((p) =>
          (p.title || "")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      : products;

    return filtered
      .slice(0, 30)
      .map((p) => ({
        ...p,
        trendScore: calculateTrendScore(p),
      }))
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 12);
  }, [products, search]);

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5" }}>
      <Head>
        <title>Koloonline</title>
      </Head>

      {/* HEADER */}
      <header
        style={{
          background: "white",
          padding: 10,
          display: "flex",
          gap: 10,
        }}
      >
        <Link href="/">🟠 Koloonline</Link>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, borderRadius: 8 }}
        />
      </header>

      {/* MAIN */}
      <main style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>
        <Hero />

        <h2>🔥 Trending</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
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

/* ================= DATA FETCH ================= */
export async function getStaticProps() {
  try {
    const snap = await getDocs(
      query(collection(db, "products"), limit(30))
    );

    const products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      props: { products },
      revalidate: 300,
    };
  } catch (e) {
    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
            }
