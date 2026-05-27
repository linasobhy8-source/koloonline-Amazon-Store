import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";

import { db } from "../config/firebase";

/* ================= SAFE ================= */

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x300?text=Koloonline";

function safeString(value, fallback = "") {
  return typeof value === "string"
    ? value
    : typeof value === "number"
    ? String(value)
    : fallback;
}

function safeNumber(value, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

/* ================= TREND SCORE ================= */

function calculateTrendScore(product = {}) {
  return (
    safeNumber(product.views) +
    safeNumber(product.clicks) * 2 +
    safeNumber(product.orders) * 5 +
    (product.viralBoost ? 50 : 0)
  );
}

/* ================= HERO ================= */

function Hero() {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
        color: "white",
        padding: 30,
        borderRadius: 16,
        marginBottom: 20,
      }}
    >
      <h1 style={{ fontSize: 22 }}>
        🔥 Viral Amazon Deals
      </h1>

      <p style={{ color: "#cbd5e1", fontSize: 14 }}>
        AI-powered trending products
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <Link href="/products" style={{ color: "white" }}>
          🛒 Products
        </Link>

        <Link href="/blog" style={{ color: "white" }}>
          📚 Blog
        </Link>
      </div>
    </section>
  );
}

/* ================= PRODUCT CARD ================= */

function ProductCard({ product }) {
  const title = safeString(product?.title, "Product");

  const image =
    typeof product?.image === "string" &&
    product.image.startsWith("http")
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
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 10,
        }}
      >
        {/* FIXED IMAGE = NO CLS */}
        <div
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            position: "relative",
          }}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            style={{
              objectFit: "cover",
              borderRadius: 10,
            }}
            priority={false}
          />
        </div>

        <h3
          style={{
            fontSize: 13,
            marginTop: 8,
            minHeight: 34,
          }}
        >
          {title.slice(0, 60)}
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

  const trendingProducts = useMemo(() => {
    const filtered = search
      ? products.filter((p) =>
          safeString(p?.title)
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      : products;

    return filtered
      .slice(0, 20) // 🔥 reduced for speed
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
        <meta name="description" content="Best Amazon Deals" />
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
        <Link href="/" style={{ fontWeight: "bold" }}>
          🟠 Koloonline
        </Link>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 8,
            width: "100%",
          }}
        />
      </header>

      {/* MAIN */}
      <main style={{ maxWidth: 1100, margin: "auto", padding: 15 }}>
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

/* ================= DATA ================= */

export async function getStaticProps() {
  try {
    const snap = await getDocs(
      query(collection(db, "products"), limit(20))
    );

    const products = snap.docs.map((doc) => ({
      id: doc.id || "",
      ...doc.data(),
    }));

    return {
      props: { products },
      revalidate: 300,
    };
  } catch (error) {
    console.error("INDEX ERROR:", error);

    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
}
