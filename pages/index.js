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

/* ================= SEO SCHEMA ENGINE ================= */
import {
  generateWebsiteSchema,
  generateItemListSchema,
} from "../lib/seo/homeSchema";

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

/* ================= SEO CONTENT BOOST SECTION ================= */
function SeoSection() {
  return (
    <section style={{ padding: 20 }}>
      <h2>Best Amazon Deals 2026</h2>

      <p>
        Koloonline is a smart shopping platform that helps users discover trending Amazon products,
        best deals, viral gadgets, and buying guides updated daily with real data-driven insights.
      </p>

      <p>
        We analyze product performance, conversion rates, and popularity to recommend the best items
        for tech, home, fitness, and lifestyle categories.
      </p>
    </section>
  );
}

/* ================= HOME ================= */
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

  const websiteSchema = generateWebsiteSchema();
  const itemListSchema = generateItemListSchema(trendingProducts);

  return (
    <div style={{ fontFamily: "Arial", background: "#eaeded" }}>

      <Head>
        <title>Koloonline - Best Amazon Deals & Trending Products 2026</title>

        <meta name="description" content="Discover Amazon deals, trending products, and smart shopping guides updated daily." />

        {/* ================= SEO CORE ================= */}
        <meta name="author" content="Koloonline" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1" />

        {/* ================= DISCOVER BOOST ================= */}
        <meta name="keywords" content="amazon deals, trending products, smart shopping, viral gadgets, best amazon products 2026" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Koloonline Smart Shopping Platform" />
        <meta property="og:description" content="Discover trending Amazon deals & viral products daily." />
        <meta property="og:url" content="https://koloonline.online/" />

        {/* SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListSchema),
          }}
        />
      </Head>

      <header style={{ padding: 20 }}>
        <h1>🟠 Koloonline</h1>
        <p>Your Smart Amazon Deals Hub</p>
      </header>

      <Hero />
      <SeoSection />

      <section style={{ padding: 20 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{ padding: 10, width: "100%" }}
        />
      </section>

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

      <section style={{ padding: 20 }}>
        <h2>📚 Latest Guides</h2>

        <ul>
          <li><Link href="/blog/best-smart-watches">Best Smart Watches</Link></li>
          <li><Link href="/blog/best-headphones-2026">Best Headphones</Link></li>
          <li><Link href="/blog/viral-products-amazon">Viral Amazon Products</Link></li>
        </ul>
      </section>

      <section style={{ padding: 20 }}>
        <h2>❓ FAQ</h2>

        <h3>What is Koloonline?</h3>
        <p>Platform for Amazon deals & smart shopping insights.</p>

        <h3>Is it updated daily?</h3>
        <p>Yes, automatically every day.</p>
      </section>

    </div>
  );
}

/* ================= DATA ================= */
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
