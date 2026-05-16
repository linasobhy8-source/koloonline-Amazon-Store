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

/* ================= HERO SECTION ================= */
function Hero() {
  return (
    <section style={{ padding: 20 }}>
      <h1>🟠 Koloonline - Best Amazon Deals & Trending Products 2026</h1>
      <p>
        Discover curated Amazon products, trending deals, and smart buying guides
        updated daily to help you shop smarter and save money.
      </p>
    </section>
  );
}

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
    <div style={{ padding: 20, background: "#f9f9f9", marginTop: 30 }}>
      <h2>🔥 Amazon Subscriptions & Free Trials</h2>

      <p>
        Explore exclusive offers like Audible free trial and Amazon services
        that can boost your productivity and entertainment.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: 20,
        marginTop: 20,
      }}>
        <div style={{ padding: 15, border: "1px solid #ddd", borderRadius: 10 }}>
          <h3>🎧 Audible</h3>
          <p>Listen to books anywhere with free trial access.</p>
          <Link href="/audible">
            <button style={{ padding: 10, cursor: "pointer" }}>
              Start Free Trial
            </button>
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
    <section style={{ padding: 20 }}>
      <h2>🔥 Auto Trending Deals</h2>
      <p>Live updated list of high-performing Amazon products.</p>

      <div style={{ display: "grid", gap: 15, marginTop: 15 }}>
        {products.map((p) => (
          <div key={p.id} style={{ padding: 10, border: "1px solid #ddd" }}>
            <h3>{p.title}</h3>
            <p>Score: {p.profitScore}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= MAIN PAGE ================= */
export default function Home({ products }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [recommendations, setRecommendations] = useState([]);

  /* ================= LOAD RECOMMENDATIONS ================= */
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

      {/* ================= SEO ================= */}
      <Head>
        <title>Koloonline - Best Amazon Deals 2026</title>

        <meta
          name="description"
          content="Discover the best Amazon deals, trending products, and smart shopping guides updated daily."
        />

        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="Koloonline - Amazon Deals 2026" />
        <meta
          property="og:description"
          content="Best Amazon deals, trending products, and smart buying guides."
        />

        <link rel="canonical" href="https://koloonline.online/" />
      </Head>

      {/* ================= HEADER ================= */}
      <header style={{ padding: 20 }}>
        <h1>🟠 Koloonline</h1>
        <p>Your Amazon Deals & Trends Hub</p>
      </header>

      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= SEARCH ================= */}
      <div style={{ padding: 20 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{ padding: 10, width: "100%" }}
        />
      </div>

      {/* ================= HOME FEED ================= */}
      <HomeFeed />

      {/* ================= RECOMMENDATIONS ================= */}
      <section style={{ padding: 20 }}>
        <h2>🔥 Best Conversion Products</h2>
        <p>Hand-picked products with highest conversion potential.</p>

        <div style={{ display: "grid", gap: 15 }}>
          {recommendations.map((p) => (
            <div key={p.id} style={{ padding: 10, border: "1px solid #ddd" }}>
              <h3>{p.title}</h3>
              <p>🔥 Conversion Score: {p.conversionScore}</p>

              <a href={p.link} target="_blank" rel="noopener noreferrer">
                Buy Now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TRENDING ================= */}
      <section style={{ padding: 20 }}>
        <h2>🔥 Trending Now</h2>
        <p>Most popular products right now based on real-time scoring.</p>

        <div style={{ display: "grid", gap: 15 }}>
          {trendingProducts.map((p) => (
            <div key={p.id} style={{ padding: 10, border: "1px solid #ddd" }}>
              <h3>{p.title}</h3>
              <p>${p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SUBSCRIPTIONS ================= */}
      <Subscriptions />

      {/* ================= FAQ (SEO BOOST) ================= */}
      <section style={{ padding: 20 }}>
        <h2>❓ Frequently Asked Questions</h2>

        <h3>What is Koloonline?</h3>
        <p>A platform for discovering the best Amazon deals and trending products.</p>

        <h3>Is this updated daily?</h3>
        <p>Yes, products and deals are updated automatically.</p>
      </section>

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
