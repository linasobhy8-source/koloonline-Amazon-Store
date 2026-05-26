import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= SAFE ================= */
function safeString(v) {
  return typeof v === "string" || typeof v === "number"
    ? String(v)
    : "";
}

function safeNumber(v) {
  return typeof v === "number" ? v : 0;
}

/* ================= TREND SCORE ================= */
function calculateTrendScore(p) {
  return (
    safeNumber(p.views) +
    safeNumber(p.clicks) * 2 +
    safeNumber(p.orders) * 5 +
    (p.viralBoost ? 50 : 0)
  );
}

/* ================= HERO ================= */
function Hero() {
  return (
    <section style={{
      background: "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
      color: "white",
      padding: 60,
      borderRadius: 20,
      marginBottom: 20
    }}>
      <h1>🔥 Discover Viral Amazon Deals</h1>

      <p style={{ color: "#cbd5e1" }}>
        AI-powered trending products
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        <Link href="/products">🛒 Products</Link>
        <Link href="/blog">📚 Blog</Link>
      </div>
    </section>
  );
}

/* ================= CARD ================= */
function ProductCard({ product }) {
  const title = safeString(product?.title);
  const image =
    typeof product?.image === "string"
      ? product.image
      : "https://via.placeholder.com/300";

  const price = safeNumber(product?.price);

  return (
    <Link href={`/product/${product?.id || ""}`}>
      <div style={{ background: "white", padding: 15, borderRadius: 16 }}>
        <Image
          src={image}
          width={250}
          height={250}
          alt={title || "product"}
          loading="lazy"
        />

        <h3 style={{ fontSize: 14 }}>
          {title.slice(0, 60)}
        </h3>

        <p style={{ color: "#b12704" }}>
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
      ? products.filter(p =>
          safeString(p?.title)
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      : products;

    return filtered
      .slice(0, 30)
      .map(p => ({
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
        <meta name="description" content="Best Amazon Deals 2026" />
      </Head>

      <header style={{ background: "white", padding: 10, display: "flex", gap: 10 }}>
        <Link href="/">🟠 Koloonline</Link>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, borderRadius: 8 }}
        />
      </header>

      <main style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>
        <Hero />

        <h2>🔥 Trending</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 10
        }}>
          {trendingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>

      <footer style={{
        marginTop: 40,
        background: "#111827",
        color: "white",
        padding: 20,
        textAlign: "center"
      }}>
        © 2026 Koloonline
      </footer>
    </div>
  );
}

/* ================= DATA ================= */
export async function getStaticProps() {
  try {
    const snap = await getDocs(
      query(collection(db, "products"), limit(30))
    );

    const products = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      props: { products },
      revalidate: 300,
    };
  } catch (e) {
    console.error("Home Error:", e);

    return {
      props: { products: [] },
      revalidate: 300,
    };
  }
}
