import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= SAFE HELPERS ================= */

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x300?text=Koloonline";

const safeString = (v, f = "") =>
  typeof v === "string" ? v : v ? String(v) : f;

const safeNumber = (v, f = 0) =>
  typeof v === "number" ? v : f;

/* ================= TREND SCORE (OPTIMIZED) ================= */

function score(p) {
  return (
    (p?.views || 0) +
    (p?.clicks || 0) * 2 +
    (p?.orders || 0) * 5 +
    (p?.viralBoost ? 50 : 0)
  );
}

/* ================= HERO (LIGHTWEIGHT) ================= */

function Hero() {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
        color: "#fff",
        padding: "20px",
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      <h1 style={{ fontSize: 20, margin: 0 }}>
        🔥 Viral Amazon Deals
      </h1>

      <p style={{ fontSize: 13, color: "#cbd5e1" }}>
        AI Trending Products
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
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

/* ================= PRODUCT CARD (NO CLS FIXED) ================= */

function ProductCard({ product }) {
  const title = safeString(product?.title, "Product");
  const image =
    typeof product?.image === "string" && product.image.startsWith("http")
      ? product.image
      : FALLBACK_IMAGE;

  const price = safeNumber(product?.price);
  const id = safeString(product?.id);

  return (
    <Link
      href={`/product/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 8,
          willChange: "transform",
        }}
      >
        {/* FIX: stable layout (CLS = 0) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            borderRadius: 10,
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
            unoptimized
          />
        </div>

        <h3
          style={{
            fontSize: 12,
            marginTop: 6,
            minHeight: 32,
          }}
        >
          {title.length > 60 ? title.slice(0, 60) + "..." : title}
        </h3>

        <p style={{ color: "#b12704", fontWeight: "bold", margin: 0 }}>
          ${price}
        </p>
      </div>
    </Link>
  );
}

/* ================= PAGE ================= */

export default function Home({ products = [] }) {
  const [search, setSearch] = useState("");

  /* 🔥 LIGHT FILTER (FAST FOR MOBILE) */
  const trendingProducts = useMemo(() => {
    let list = products;

    if (search) {
      const q = search.toLowerCase();
      list = products.filter((p) =>
        (p?.title || "").toLowerCase().includes(q)
      );
    }

    return list
      .slice(0, 15) // reduce CPU
      .sort((a, b) => score(b) - score(a))
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
          background: "#fff",
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
          onChange={(e) => setSearch(e.target.value)}
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

        <h2 style={{ fontSize: 16 }}>🔥 Trending</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: 8,
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
          marginTop: 30,
          background: "#111827",
          color: "white",
          padding: 15,
          textAlign: "center",
          fontSize: 12,
        }}
      >
        © 2026 Koloonline
      </footer>
    </div>
  );
}

/* ================= DATA (OPTIMIZED FIRESTORE) ================= */

export async function getStaticProps() {
  try {
    const snap = await getDocs(
      query(collection(db, "products"), limit(20))
    );

    const products = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        title: d?.title || "",
        image: d?.image || FALLBACK_IMAGE,
        price: d?.price || 0,
        views: d?.views || 0,
        clicks: d?.clicks || 0,
        orders: d?.orders || 0,
        viralBoost: d?.viralBoost || false,
      };
    });

    return {
      props: { products },
      revalidate: 600, // 🔥 faster caching = better RES
    };
  } catch (e) {
    console.error(e);

    return {
      props: { products: [] },
      revalidate: 600,
    };
  }
}
