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

/* ================= SAFE TREND SCORE ================= */
function calculateTrendScore(product) {
  return (
    (product.views || 0) * 1 +
    (product.clicks || 0) * 3 +
    (product.orders || 0) * 8 +
    (product.rating || 4.5) * 20 +
    (product.viralBoost ? 80 : 0)
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
        padding: "80px 20px",
        borderRadius: 24,
        marginBottom: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div style={{ flex: 1, minWidth: 300 }}>
          <h1 style={{ fontSize: 52 }}>
            Discover Viral Amazon Deals
          </h1>

          <p style={{ color: "#cbd5e1" }}>
            AI-powered shopping platform for trending products.
          </p>

          <div style={{ display: "flex", gap: 15, marginTop: 25 }}>
            <Link href="/products">
              <button>🛒 Products</button>
            </Link>

            <Link href="/blog">
              <button>📚 Blog</button>
            </Link>
          </div>

          {/* ✅ AFFILIATE BUTTONS */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>

            <Link href="/fiverr">
              <span style={{
                background: "#1dbf73",
                padding: "10px 14px",
                borderRadius: 12,
                color: "white",
                fontWeight: "bold"
              }}>
                💼 Fiverr
              </span>
            </Link>

            <Link href="/aliexpress">
              <span style={{
                background: "#ff4d4d",
                padding: "10px 14px",
                borderRadius: 12,
                color: "white",
                fontWeight: "bold"
              }}>
                🛍️ AliExpress
              </span>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= PRODUCT CARD ================= */
function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div style={{ background: "white", padding: 20, borderRadius: 20 }}>
        <Image
          src={product.image || "https://via.placeholder.com/500"}
          width={300}
          height={300}
          alt={product.title}
        />
        <h3>{product.title}</h3>
        <p>${product.price}</p>
      </div>
    </Link>
  );
}

/* ================= PAGE ================= */
export default function Home({ products }) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      )
      .map((p) => ({
        ...p,
        trendScore: calculateTrendScore(p),
      }))
      .sort((a, b) => b.trendScore - a.trendScore);
  }, [products, search]);

  const trendingProducts = filteredProducts.slice(0, 12);

  return (
    <div style={{ fontFamily: "Arial", background: "#f1f5f9" }}>

      <Head>
        <title>Koloonline - Smart Shopping</title>
      </Head>

      {/* ================= HEADER ================= */}
      <header style={{
        background: "white",
        padding: 15,
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10
      }}>
        <Link href="/">🟠 Koloonline</Link>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 10, borderRadius: 10 }}
        />

        <div style={{ display: "flex", gap: 10 }}>

          <Link href="/fiverr">
            <span>💼 Fiverr</span>
          </Link>

          <Link href="/aliexpress">
            <span>🛍️ AliExpress</span>
          </Link>

          <a href="https://linasobhy.blogspot.com" target="_blank">
            Blog
          </a>

        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>

        <Hero />

        <h2>🔥 Trending Products</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: 20
        }}>
          {trendingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

      </main>

      {/* ================= FOOTER ================= */}
      <footer style={{
        marginTop: 60,
        background: "#111827",
        color: "white",
        padding: 40
      }}>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>

          <div>
            <h3>Koloonline</h3>
            <p>AI Shopping Platform</p>
          </div>

          <div>
            <h4>Links</h4>
            <Link href="/products">Products</Link><br />
            <Link href="/blog">Blog</Link>
          </div>

          <div>
            <h4>Affiliate</h4>

            <Link href="/fiverr">💼 Fiverr</Link><br />
            <Link href="/aliexpress">🛍️ AliExpress</Link>
          </div>

          <div>
            <h4>External</h4>

            <a href="https://go.fiverr.com/visit/?bta=1148086&brand=fiverrmarketplace">
              Fiverr Offer
            </a><br />

            <a href="https://s.click.aliexpress.com/e/_c2zsFdx9">
              AliExpress Deals
            </a><br />

            <a href="https://linasobhy.blogspot.com">
              Blogger
            </a>
          </div>

        </div>

        <p style={{ textAlign: "center", marginTop: 30 }}>
          © 2026 Koloonline
        </p>

      </footer>

    </div>
  );
}

/* ================= DATA ================= */
export async function getStaticProps() {
  const snap = await getDocs(
    query(collection(db, "products"), limit(60))
  );

  const products = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    props: { products },
    revalidate: 60,
  };
}
