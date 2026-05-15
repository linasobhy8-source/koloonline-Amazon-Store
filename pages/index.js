import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";

import { db } from "../config/firebase";
import { calculateTrendScore } from "../lib/trendScore";

const fallbackImage = "https://via.placeholder.com/300";

/* ================= BREADCRUMB ================= */
function Breadcrumb({ category }) {
  return (
    <div style={{ padding: "10px 20px", fontSize: 14, color: "#555" }}>
      <Link href="/">Home</Link> /{" "}
      <span>{category === "all" ? "All Products" : category}</span>
    </div>
  );
}

/* ================= SUBSCRIPTIONS ================= */
function Subscriptions() {
  return (
    <div style={{ padding: 20, background: "#f9f9f9" }}>
      <h2>🔥 Amazon Subscriptions</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: 20,
        marginTop: 20,
      }}>
        <div>
          <h3>🎧 Audible</h3>
          <Link href="/audible">
            <button>Start Free Trial</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ================= HOME FEED ================= */
function HomeFeed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/home-feed")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.topProducts || []);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🔥 Auto Trending Deals</h2>

      <div style={{ display: "grid", gap: 15 }}>
        {products.map((p) => (
          <div key={p.id} style={{ padding: 10, border: "1px solid #ddd" }}>
            <h3>{p.title}</h3>
            <p>Score: {p.profitScore}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function Home({ products }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [aiDescriptions, setAiDescriptions] = useState({});

  /* ================= 🔥 NEW: RECOMMENDATIONS STATE ================= */
  const [recommendations, setRecommendations] = useState([]);

  /* ================= 🔥 LOAD RECOMMENDATIONS ================= */
  useEffect(() => {
    fetch("/api/recommendations")
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.topPicks || []);
      });
  }, []);

  const filtered = products
    .filter((p) => {
      return (
        p.title?.toLowerCase().includes(search.toLowerCase()) &&
        (category === "all" ||
          p.category?.toLowerCase() === category.toLowerCase())
      );
    })
    .map((p) => ({
      ...p,
      trendScore: calculateTrendScore(p),
    }))
    .sort((a, b) => b.trendScore - a.trendScore);

  const trendingProducts = filtered.slice(0, 10);

  return (
    <div style={{ fontFamily: "Arial", background: "#eaeded" }}>
      <Head>
        <title>Best Amazon Deals 2026</title>
      </Head>

      <header>
        <h1>🟠 Koloonline</h1>
      </header>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />

      {/* ================= HOME FEED ================= */}
      <HomeFeed />

      {/* ================= 🔥 CONVERSION ENGINE (HERE IT IS) ================= */}
      <section style={{ padding: 20 }}>
        <h2>🔥 Best Conversion Products</h2>

        <div style={{ display: "grid", gap: 15 }}>
          {recommendations.map((p) => (
            <div key={p.id} style={{ padding: 10, border: "1px solid #ddd" }}>
              <h3>{p.title}</h3>
              <p>🔥 Conversion Score: {p.conversionScore}</p>

              <a href={p.link} target="_blank">
                Buy Now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TRENDING ================= */}
      <h2>🔥 Trending Now</h2>

      <div style={{ display: "grid", gap: 15 }}>
        {trendingProducts.map((p) => (
          <div key={p.id}>
            <h3>{p.title}</h3>
            <p>${p.price}</p>
          </div>
        ))}
      </div>

      <Subscriptions />
    </div>
  );
}

/* ================= SSG ================= */
export async function getStaticProps() {
  const snap = await getDocs(
    query(collection(db, "products"), limit(50))
  );

  return {
    props: {
      products: snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })),
    },
    revalidate: 60,
  };
}
