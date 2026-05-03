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

/* ================= BREADCRUMB UI ================= */
function Breadcrumb({ category }) {
  return (
    <div style={{ padding: "10px 20px", fontSize: 14, color: "#555" }}>
      <Link href="/">Home</Link> /{" "}
      <span>{category === "all" ? "All Products" : category}</span>
    </div>
  );
}

/* ================= PAGE ================= */
export default function Home({ products }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

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

      {/* ================= SEO LEVEL 3 ================= */}
      <Head>
        <title>Koloonline | Best Amazon Deals</title>

        <meta
          name="description"
          content="Best Amazon affiliate deals in Electronics, Fashion, Home & Sports"
        />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

        <link rel="canonical" href={siteUrl} />

        {/* Open Graph */}
        <meta property="og:title" content="Koloonline Amazon Deals" />
        <meta property="og:description" content="Best Amazon deals updated daily" />
        <meta property="og:image" content={`${siteUrl}/favicon.ico`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* ================= 🔥 ITEMLIST SCHEMA ================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: filtered.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${siteUrl}/product/${p.id}`,
                name: p.title,
                image: p.image || fallbackImage
              })),
            }),
          }}
        />

        {/* ================= 🔥 SITE STRUCTURED DATA ================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Koloonline",
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
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

        <div style={navRight}>
          <span>Account</span>
          <span>Orders</span>
          <span>Cart 🛒</span>
        </div>
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
      </nav>

      {/* ================= BREADCRUMB ================= */}
      <Breadcrumb category={category} />

      {/* ================= HERO ================= */}
      <div style={hero}>
        🔥 Best Amazon Deals Today
      </div>

      {/* ================= PRODUCTS ================= */}
      <div style={grid}>
        {filtered.map((p) => (
          <div key={p.id} style={card}>

            <img src={p.image || fallbackImage} style={img} />

            <h3 style={title}>{p.title}</h3>

            <p style={price}>${p.price}</p>

            {/* ⭐ SEO BOOST: internal linking */}
            <Link href={`/product/${p.id}`}>
              <button style={btn}>View</button>
            </Link>

            <a href={p.link} target="_blank" rel="noopener noreferrer">
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
  gap: 10,
};

const logo = { fontSize: 22, fontWeight: "bold" };

const searchBox = {
  flex: 1,
  padding: 10,
  borderRadius: 5,
  border: "none",
};

const navRight = {
  display: "flex",
  gap: 10,
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
};

const img = {
  width: "100%",
  height: 180,
  objectFit: "cover",
};

const title = {
  fontSize: 14,
  height: 40,
  overflow: "hidden",
};

const price = {
  color: "#B12704",
  fontWeight: "bold",
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
