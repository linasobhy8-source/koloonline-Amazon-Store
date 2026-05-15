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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        <div style={card}>
          <h3>🎧 Audible</h3>
          <p>Listen to books – Free trial</p>
          <Link href="/audible">
            <button style={buy}>🎧 Start Free Trial</button>
          </Link>
        </div>

        <div style={card}>
          <h3>📚 Kindle Unlimited</h3>
          <a
            href="https://www.amazon.com/kindle-dbs/hz/subscribe/ku?tag=koloonlinesto-20"
            target="_blank"
          >
            <button style={btn}>Subscribe</button>
          </a>
        </div>

        <div style={card}>
          <h3>🚀 Amazon Prime</h3>
          <a
            href="https://www.amazon.com/amazonprime?tag=koloonlinesto-20"
            target="_blank"
          >
            <button style={buy}>Try Prime</button>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ================= HOME FEED (🔥 AUTO PROFIT SYSTEM) ================= */
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

      <div style={grid}>
        {products.map((p) => (
          <div key={p.id} style={card}>
            <img src={p.image || fallbackImage} style={img} />

            <h3 style={title}>{p.title}</h3>

            <p style={price}>Score: {p.profitScore?.toFixed(2)}</p>

            <Link href={`/product/${p.id}`}>
              <button style={btn}>View</button>
            </Link>
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

  const generateDescription = async (product) => {
    const res = await fetch("/api/generate-description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: product.title }),
    });

    const data = await res.json();

    setAiDescriptions((prev) => ({
      ...prev,
      [product.id]: data.description,
    }));
  };

  const generateBlog = async () => {
    const keyword = prompt("اكتب كلمة للمقال");
    if (!keyword) return;

    await fetch("/api/generate-blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword }),
    });

    alert("تم إنشاء المقال 🔥");
  };

  /* ================= FILTER ================= */
  const filtered = products
    .filter((p) => {
      const matchSearch = p.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "all" ||
        p.category?.toLowerCase() === category.toLowerCase();

      return matchSearch && matchCategory;
    })
    .map((p) => ({
      ...p,
      trendScore: calculateTrendScore(p),
    }))
    .sort((a, b) => b.trendScore - a.trendScore);

  const trendingProducts = [...filtered].slice(0, 10);

  const siteUrl = "https://koloonline.online";

  return (
    <div style={{ fontFamily: "Arial", background: "#eaeded" }}>
      <Head>
        <title>Best Amazon Deals & Product Reviews 2026</title>
      </Head>

      {/* HEADER */}
      <header style={header}>
        <div style={logo}>🟠 Koloonline</div>

        <input
          placeholder="Search Amazon products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchBox}
        />
      </header>

      {/* NAV */}
      <nav style={nav}>
        {["all", "Electronics", "Fashion", "Home", "Sports"].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{
              ...navBtn,
              background: category === c ? "#febd69" : "transparent",
            }}
          >
            {c}
          </button>
        ))}

        <Link href="/amazon-haul">
          <button style={{ ...navBtn, background: "#ff6600" }}>
            🔥 Amazon Haul
          </button>
        </Link>
      </nav>

      <Breadcrumb category={category} />

      <div style={hero}>🔥 Best Amazon Deals Today</div>

      {/* BLOG BUTTON */}
      <div style={{ padding: 20, textAlign: "center" }}>
        <button onClick={generateBlog} style={btn}>
          ✨ Generate Blog Article
        </button>
      </div>

      {/* 🔥 HOME FEED SYSTEM (NEW) */}
      <HomeFeed />

      {/* TRENDING */}
      <div style={{ padding: 20 }}>
        <h2>🔥 Trending Now</h2>

        <div style={grid}>
          {trendingProducts.map((p) => (
            <div key={p.id} style={card}>
              <img src={p.image} style={img} />

              <h3 style={title}>{p.title}</h3>

              <p style={price}>${p.price}</p>

              <a href={p.link} target="_blank">
                <button style={buy}>🛒 Buy Now</button>
              </a>
            </div>
          ))}
        </div>
      </div>

      <Subscriptions />

      {/* ALL PRODUCTS */}
      <div style={grid}>
        {filtered.map((p) => (
          <div key={p.id} style={card}>
            <img src={p.image || fallbackImage} style={img} />

            <h3 style={title}>{p.title}</h3>

            <p style={price}>${p.price}</p>

            <Link href={`/product/${p.id}`}>
              <button style={btn}>View</button>
            </Link>

            <a href={p.link} target="_blank">
              <button style={buy}>Buy</button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= SSG ================= */
export async function getStaticProps() {
  const snap = await getDocs(
    query(collection(db, "products"), limit(50))
  );

  const products = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return {
    props: { products },
    revalidate: 60,
  };
}
