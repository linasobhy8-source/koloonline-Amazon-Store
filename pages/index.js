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
        Discover the best Amazon deals, trending products, viral gadgets, and smart buying guides updated daily.
      </p>
    </section>
  );
}

/* ================= SEO SECTION ================= */
function SeoSection() {
  return (
    <section style={{ padding: 20 }}>
      <h2>Best Amazon Deals 2026</h2>

      <p>
        Koloonline helps users discover trending Amazon products and high-conversion deals using data-driven analysis.
      </p>
    </section>
  );
}

/* ================= MAIN ================= */
export default function Home({ products }) {
  const [search, setSearch] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch("/api/recommendations")
      .then((res) => res.json())
      .then((data) => setRecommendations(data.topPicks || []))
      .catch(() => setRecommendations([]));
  }, []);

  const filtered = products
    .filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    )
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

      {/* ================= SEO + DISCOVER ================= */}
      <Head>
        <title>Koloonline - Amazon Deals & Trending Products 2026</title>

        <meta name="description" content="Discover Amazon deals, trending products, and smart shopping guides updated daily." />

        {/* E-E-A-T CORE */}
        <meta name="author" content="Koloonline" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1" />

        {/* DISCOVER BOOST */}
        <meta name="keywords" content="amazon deals, trending products, viral gadgets, smart shopping 2026" />

        {/* OPEN GRAPH (CRITICAL FOR DISCOVER) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Koloonline Smart Shopping Platform" />
        <meta property="og:description" content="Best Amazon deals & trending products updated daily." />
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

      {/* ================= HEADER ================= */}
      <header style={{ padding: 20 }}>
        <h1>🟠 Koloonline</h1>
        <p>Smart Amazon Deals Engine</p>
      </header>

      {/* ================= CONTENT ================= */}
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

      {/* ================= TRENDING ================= */}
      <section style={{ padding: 20 }}>
        <h2>🔥 Trending Now</h2>

        <div style={{ display: "grid", gap: 15 }}>
          {trendingProducts.map((p) => (
            <div key={p.id} style={{ padding: 10, border: "1px solid #ddd", background: "#fff" }}>
              <h3>{p.title}</h3>
              <p>${p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= GUIDES ================= */}
      <section style={{ padding: 20 }}>
        <h2>📚 Latest Guides</h2>

        <ul>
          <li><Link href="/blog/best-smart-watches">Best Smart Watches</Link></li>
          <li><Link href="/blog/best-headphones-2026">Best Headphones</Link></li>
          <li><Link href="/blog/viral-products-amazon">Viral Amazon Products</Link></li>
        </ul>
      </section>

      {/* ================= ABOUT / E-E-A-T BOOST ================= */}
      <section style={{ padding: 20, background: "#fff", marginTop: 20 }}>
        <h2>About Koloonline</h2>
        <p>
          Koloonline is a smart affiliate platform focused on helping users find
          the best Amazon deals using data-driven insights, trend analysis, and product research.
        </p>
      </section>

      {/* ================= FAQ ================= */}
      <section style={{ padding: 20 }}>
        <h2>❓ FAQ</h2>

        <h3>What is Koloonline?</h3>
        <p>Amazon deals & smart shopping platform.</p>

        <h3>Is it updated daily?</h3>
        <p>Yes, fully automated daily updates.</p>
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
