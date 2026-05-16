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

/* ================= HERO ================= */
function Hero() {
  return (
    <section style={{ padding: 20 }}>
      <h1>
        🟠 Koloonline - Best Amazon Deals, Trending Products & Smart Shopping Guide 2026
      </h1>

      <p>
        Discover the best Amazon deals, trending products, viral gadgets, and
        smart buying guides updated daily. We help you find top-rated products
        and save money with real data-driven recommendations.
      </p>
    </section>
  );
}

/* ================= HOME FEED ================= */
function HomeFeed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/home-feed")
      .then((res) => res.json())
      .then((data) => setProducts(data.topProducts || []))
      .catch(() => setProducts([]));
  }, []);

  return (
    <section style={{ padding: 20 }}>
      <h2>🔥 Auto Trending Deals</h2>
      <p>Live updated Amazon products with high engagement and conversions.</p>

      <div style={{ display: "grid", gap: 15, marginTop: 15 }}>
        {products.map((p) => (
          <div key={p.id} style={{ padding: 10, border: "1px solid #ddd" }}>
            <h3>{p.title}</h3>
            <p>🔥 Score: {p.profitScore}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= SUBSCRIPTIONS ================= */
function Subscriptions() {
  return (
    <section style={{ padding: 20, background: "#f9f9f9", marginTop: 30 }}>
      <h2>🔥 Amazon Services & Free Trials</h2>

      <p>
        Explore Amazon services like Audible and exclusive free trials that
        enhance your shopping and entertainment experience.
      </p>

      <div style={{ marginTop: 15 }}>
        <h3>🎧 Audible</h3>
        <p>Listen to audiobooks anywhere with free trial access.</p>

        <Link href="/audible">
          <button style={{ padding: 10 }}>Start Free Trial</button>
        </Link>
      </div>
    </section>
  );
}

/* ================= MAIN PAGE ================= */
export default function Home({ products }) {
  const [search, setSearch] = useState("");
  const [category] = useState("all");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch("/api/recommendations")
      .then((res) => res.json())
      .then((data) => setRecommendations(data.topPicks || []))
      .catch(() => setRecommendations([]));
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
        <title>
          Koloonline - Best Amazon Deals, Trending Products & Smart Shopping Guide 2026
        </title>

        <meta
          name="description"
          content="Discover the best Amazon deals, trending products, smart gadgets, and buying guides updated daily."
        />

        <meta
          name="keywords"
          content="amazon deals, trending products, amazon gadgets, best amazon products 2026, smart shopping"
        />

        <link rel="canonical" href="https://koloonline.online/" />

        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Koloonline Amazon Deals 2026" />
        <meta
          property="og:description"
          content="Best Amazon deals, trending products, and smart shopping guides."
        />
        <meta property="og:url" content="https://koloonline.online/" />

        {/* ================= PERFORMANCE BOOST ================= */}
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.amazon.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.amazon.com" />
      </Head>

      {/* ================= HEADER ================= */}
      <header style={{ padding: 20 }}>
        <h1>🟠 Koloonline</h1>
        <p>Your Smart Amazon Deals Hub</p>
      </header>

      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= SEARCH ================= */}
      <section style={{ padding: 20 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{ padding: 10, width: "100%" }}
        />
      </section>

      {/* ================= HOME FEED ================= */}
      <HomeFeed />

      {/* ================= RECOMMENDATIONS ================= */}
      <section style={{ padding: 20 }}>
        <h2>🔥 Best Conversion Products</h2>

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

        <div style={{ display: "grid", gap: 15 }}>
          {trendingProducts.map((p) => (
            <div key={p.id} style={{ padding: 10, border: "1px solid #ddd" }}>
              <h3>{p.title}</h3>
              <p>${p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BLOG LINKS ================= */}
      <section style={{ padding: 20 }}>
        <h2>📚 Latest Guides</h2>

        <ul>
          <li><Link href="/blog/best-smart-watches">Best Smart Watches</Link></li>
          <li><Link href="/blog/best-headphones-2026">Best Headphones</Link></li>
          <li><Link href="/blog/viral-products-amazon">Viral Amazon Products</Link></li>
        </ul>
      </section>

      {/* ================= SUBSCRIPTIONS ================= */}
      <Subscriptions />

      {/* ================= FAQ ================= */}
      <section style={{ padding: 20 }}>
        <h2>❓ Frequently Asked Questions</h2>

        <h3>What is Koloonline?</h3>
        <p>
          Koloonline is a platform for discovering Amazon deals, trending products,
          and smart shopping recommendations.
        </p>

        <h3>Is it updated daily?</h3>
        <p>Yes, all products are updated automatically every day.</p>
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
