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
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function safeNumber(value, fallback = 0) {
  return typeof value === "number"
    ? value
    : fallback;
}

/* ================= TREND SCORE ================= */

function calculateTrendScore(product) {
  return (
    safeNumber(product?.views) +
    safeNumber(product?.clicks) * 2 +
    safeNumber(product?.orders) * 5 +
    (product?.viralBoost ? 50 : 0)
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
        padding: 60,
        borderRadius: 20,
        marginBottom: 20,
      }}
    >
      <h1>🔥 Discover Viral Amazon Deals</h1>

      <p style={{ color: "#cbd5e1" }}>
        AI-powered trending products
      </p>

      <div
        style={{
          display: "flex",
          gap: 15,
          marginTop: 20,
        }}
      >
        <Link
          href="/products"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          <span>🛒 Products</span>
        </Link>

        <Link
          href="/blog"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          <span>📚 Blog</span>
        </Link>
      </div>
    </section>
  );
}

/* ================= PRODUCT CARD ================= */

function ProductCard({ product }) {
  const title = safeString(
    product?.title,
    "Amazon Product"
  );

  const image =
    typeof product?.image === "string" &&
    product.image.startsWith("http")
      ? product.image
      : FALLBACK_IMAGE;

  const price = safeNumber(product?.price);

  const productId = safeString(product?.id);

  return (
    <Link
      href={`/product/${productId}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 15,
          borderRadius: 16,
        }}
      >
        <Image
          src={image}
          width={250}
          height={250}
          alt={title}
          unoptimized
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
          }}
        />

        <h3
          style={{
            fontSize: 14,
            marginTop: 10,
          }}
        >
          {title.slice(0, 60)}
        </h3>

        <p
          style={{
            color: "#b12704",
          }}
        >
          ${price}
        </p>
      </div>
    </Link>
  );
}

/* ================= PAGE ================= */

export default function Home({
  products = [],
}) {
  const [search, setSearch] =
    useState("");

  const trendingProducts =
    useMemo(() => {
      const filtered = search
        ? products.filter((p) =>
            safeString(p?.title)
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          )
        : products;

      return filtered
        .slice(0, 30)
        .map((p) => ({
          ...p,
          trendScore:
            calculateTrendScore(p),
        }))
        .sort(
          (a, b) =>
            b.trendScore -
            a.trendScore
        )
        .slice(0, 12);
    }, [products, search]);

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

        <meta
          name="description"
          content="Best Amazon Deals"
        />
      </Head>

      <header
        style={{
          background: "white",
          padding: 10,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "black",
            fontWeight: "bold",
          }}
        >
          <span>🟠 Koloonline</span>
        </Link>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            padding: 8,
            borderRadius: 8,
          }}
        />
      </header>

      <main
        style={{
          maxWidth: 1200,
          margin: "auto",
          padding: 20,
        }}
      >
        <Hero />

        <h2>🔥 Trending</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 10,
          }}
        >
          {trendingProducts.map((p) => (
            <ProductCard
              key={safeString(p?.id)}
              product={p}
            />
          ))}
        </div>
      </main>

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
      query(
        collection(db, "products"),
        limit(30)
      )
    );

    const products = snap.docs.map(
      (doc) => ({
        id: safeString(doc.id),
        ...doc.data(),
      })
    );

    return {
      props: {
        products,
      },

      revalidate: 300,
    };
  } catch (error) {
    console.error(
      "INDEX ERROR:",
      error
    );

    return {
      props: {
        products: [],
      },

      revalidate: 300,
    };
  }
                        }
