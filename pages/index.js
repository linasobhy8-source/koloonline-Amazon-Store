import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import {
  collection,
  getDocs,
  query,
  limit
} from "firebase/firestore";

import { db } from "../config/firebase";

const fallbackImage = "https://via.placeholder.com/300";

/* ================= 🔥 TRENDING PRODUCTS ================= */
const trendingProducts = [
  {
    id: "t1",
    title: "Wireless Bluetooth Earbuds",
    price: "29",
    image: "https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL1500_.jpg",
    link: "https://www.amazon.com/dp/B09V7Z4TJG?tag=koloonline-20"
  },
  {
    id: "t2",
    title: "Smart Watch Fitness Tracker",
    price: "39",
    image: "https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_SL1500_.jpg",
    link: "https://www.amazon.com/dp/B0B4WZ9Q1K?tag=koloonline-20"
  },
  {
    id: "t3",
    title: "Fast Charging Power Bank",
    price: "25",
    image: "https://m.media-amazon.com/images/I/71lVwl3q-kL._AC_SL1500_.jpg",
    link: "https://www.amazon.com/dp/B08LH26PFT?tag=koloonline-20"
  }
];

/* ================= BREADCRUMB ================= */
function Breadcrumb({ category }) {
  return (
    <div style={{ padding: "10px 20px", fontSize: 14, color: "#555" }}>
      <Link href="/">Home</Link> /{" "}
      <span>{category === "all" ? "All Products" : category}</span>
    </div>
  );
}

/* ================= 🔥 SUBSCRIPTIONS ================= */
function Subscriptions() {
  return (
    <div style={{ padding: 20, background: "#f9f9f9" }}>
      <h2>🔥 Amazon Subscriptions</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: 20,
        marginTop: 20
      }}>

        <div style={card}>
          <h3>🎧 Audible</h3>
          <p>Listen to books – Free trial</p>
          <Link href="/audible">
            <button style={buy}>🎧 Start Free Trial</button>
          </Link>
        </div>

        <div style={card}>
          <h3>📚 Kindle Unlimited</h3>
          <a href="https://www.amazon.com/kindle-dbs/hz/subscribe/ku?tag=koloonlinesto-20" target="_blank">
            <button style={btn}>Subscribe</button>
          </a>
        </div>

        <div style={card}>
          <h3>🚀 Amazon Prime</h3>
          <a href="https://www.amazon.com/amazonprime?tag=koloonlinesto-20" target="_blank">
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

  // ✅ AI وصف المنتج
  const generateDescription = async (product) => {
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: product.title })
      });

      const data = await res.json();

      setAiDescriptions((prev) => ({
        ...prev,
        [product.id]: data.description
      }));
    } catch (e) {
      console.log(e);
    }
  };

  // ✅ AI مقال
  const generateBlog = async () => {
    const keyword = prompt("اكتب كلمة للمقال");

    if (!keyword) return;

    await fetch("/api/generate-blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ keyword })
    });

    alert("تم إنشاء المقال 🔥");
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "all" ||
      p.category?.toLowerCase() === category.toLowerCase();

    return matchSearch && matchCategory;
  });

  const siteUrl = "https://koloonline.online";

  return (
    <div style={{ fontFamily: "Arial", background: "#eaeded" }}>

      <Head>
        <title>Koloonline | Best Amazon Deals</title>
        <meta name="description" content="Best Amazon affiliate deals" />
        <link rel="canonical" href={siteUrl} />
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
      </nav>

      <Breadcrumb category={category} />

      <div style={hero}>🔥 Best Amazon Deals Today</div>

      {/* 🔥 AI BLOG BUTTON */}
      <div style={{ padding: 20, textAlign: "center" }}>
        <button onClick={generateBlog} style={{
          padding: 15,
          fontSize: 16,
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: 5
        }}>
          ✨ Generate Blog Article
        </button>
      </div>

      {/* TRENDING */}
      <div style={{ padding: 20 }}>
        <h2>🔥 Trending Now</h2>

        <div style={grid}>
          {trendingProducts.map((p) => (
            <div key={p.id} style={card}>
              <img src={p.image} style={img} />
              <h3 style={title}>{p.title}</h3>
              <p style={price}>${p.price}</p>

              <button style={btn} onClick={() => generateDescription(p)}>
                ✨ Generate AI Description
              </button>

              {aiDescriptions[p.id] && (
                <p style={{ fontSize: 12 }}>{aiDescriptions[p.id]}</p>
              )}

              <a href={p.link} target="_blank">
                <button style={buy}>🛒 Buy Now</button>
              </a>
            </div>
          ))}
        </div>
      </div>

      <Subscriptions />

      {/* PRODUCTS */}
      <div style={grid}>
        {filtered.map((p) => (
          <div key={p.id} style={card}>
            <img src={p.image || fallbackImage} style={img} />
            <h3 style={title}>{p.title}</h3>
            <p style={price}>${p.price}</p>

            <button style={btn} onClick={() => generateDescription(p)}>
              ✨ Generate AI Description
            </button>

            {aiDescriptions[p.id] && (
              <p style={{ fontSize: 12 }}>{aiDescriptions[p.id]}</p>
            )}

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

/* ================= SSR ================= */
export async function getServerSideProps() {
  const snap = await getDocs(
    query(collection(db, "products"), limit(50))
  );

  const products = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return {
    props: { products },
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

const searchBox = {
  flex: 1,
  padding: 10,
  borderRadius: 5,
  border: "none",
};

const nav = {
  background: "#232f3e",
  padding: 10,
  display: "flex",
  gap: 10,
};

const navBtn = {
  color: "white",
  border: "none",
  padding: 8,
};

const hero = {
  background: "linear-gradient(#f3a847,#e47911)",
  padding: 30,
  textAlign: "center",
  fontSize: 22,
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
};

const img = {
  width: "100%",
  height: 180,
  objectFit: "cover",
};

const title = {
  fontSize: 14,
};

const price = {
  color: "#B12704",
};

const btn = {
  width: "100%",
  padding: 10,
  background: "#ff9900",
  border: "none",
  marginTop: 5,
};

const buy = {
  width: "100%",
  padding: 10,
  background: "#ffd814",
  border: "none",
  marginTop: 5,
};
