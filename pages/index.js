import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
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
    /* 🔥 TREND ENGINE الحقيقي */
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
        <title>Best Amazon Deals & Product Reviews 2026 | Koloonline</title>

        <meta
          name="description"
          content="Discover the best Amazon deals, product reviews, and buying guides for 2026."
        />

        <link rel="canonical" href={siteUrl} />
      </Head>

      {/* ================= HEADER ================= */}
      <header style={header}>
        <div style={logo}>🟠 Koloonline</div>

        <input
          placeholder="Search Amazon products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchBox}
        />
      </header>

      {/* ================= NAV ================= */}
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
          <button
            style={{
              ...navBtn,
              background: "#ff6600",
              fontWeight: "bold",
            }}
          >
            🔥 Amazon Haul
          </button>
        </Link>
      </nav>

      <Breadcrumb category={category} />

      <div style={hero}>🔥 Best Amazon Deals Today</div>

      {/* ================= BLOG ================= */}
      <div style={{ padding: 20, textAlign: "center" }}>
        <button
          onClick={generateBlog}
          style={{
            padding: 15,
            fontSize: 16,
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 5,
          }}
        >
          ✨ Generate Blog Article
        </button>
      </div>

      {/* ================= TRENDING ================= */}
      <div style={{ padding: 20 }}>
        <h2>🔥 Trending Now</h2>

        <div style={grid}>
          {trendingProducts.map((p) => (
            <div key={p.id} style={card}>
              <img src={p.image} style={img} />

              <h3 style={title}>{p.title}</h3>

              <p style={price}>${p.price}</p>

              {p.viralBoost && (
                <div
                  style={{
                    background: "red",
                    color: "white",
                    fontSize: 11,
                    padding: "3px 6px",
                    borderRadius: 6,
                    display: "inline-block",
                  }}
                >
                  🔥 VIRAL
                </div>
              )}

              <button style={btn} onClick={() => generateDescription(p)}>
                ✨ AI Description
              </button>

              <a href={p.link} target="_blank">
                <button style={buy}>🛒 Buy Now</button>
              </a>
            </div>
          ))}
        </div>
      </div>

      <Subscriptions />

      {/* ================= PRODUCTS ================= */}
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
              <button style={buy}>Buy on Amazon</button>
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

/* ================= STYLES ================= */

const header = {
  background: "#131921",
  color: "white",
  display: "flex",
  alignItems: "center",
  padding: 10,
};

const logo = { fontSize: 22, fontWeight: "bold" };
const searchBox = { flex: 1, padding: 10, borderRadius: 5, border: "none" };

const nav = {
  background: "#232f3e",
  padding: 10,
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const navBtn = {
  color: "white",
  border: "none",
  padding: 8,
  cursor: "pointer",
};

const hero = {
  background: "linear-gradient(#f3a847,#e47911)",
  padding: 30,
  textAlign: "center",
  fontSize: 22,
  fontWeight: "bold",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 15,
  padding: 20,
};

const card = {
  background: "white",
  padding: 10,
  borderRadius: 10,
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const img = {
  width: "100%",
  height: 180,
  objectFit: "cover",
  borderRadius: 8,
};

const title = { fontSize: 14, minHeight: 40 };
const price = { color: "#B12704", fontWeight: "bold" };

const btn = {
  width: "100%",
  padding: 10,
  background: "#ff9900",
  border: "none",
  marginTop: 5,
  borderRadius: 6,
  cursor: "pointer",
};

const buy = {
  width: "100%",
  padding: 10,
  background: "#ffd814",
  border: "none",
  marginTop: 5,
  borderRadius: 6,
  cursor: "pointer",
};
