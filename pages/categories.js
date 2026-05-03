import Head from "next/head";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ================= PAGE ================= */
export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const snap = await getDocs(collection(db, "products"));

    const cats = new Set();

    snap.forEach((doc) => {
      const data = doc.data();
      if (data.category) cats.add(data.category.toLowerCase());
    });

    setCategories([...cats]);
  }

  return (
    <div style={{ fontFamily: "Arial", background: "#f3f3f3", minHeight: "100vh" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>Categories | Koloonline Amazon Deals</title>

        <meta
          name="description"
          content="Browse Amazon categories: Electronics, Fashion, Home, Sports - Best Deals Daily"
        />

        <link rel="canonical" href="https://koloonline.online/categories" />

        {/* Open Graph */}
        <meta property="og:title" content="Amazon Categories - Koloonline" />
        <meta property="og:description" content="Explore top Amazon product categories" />
        <meta property="og:type" content="website" />

        {/* ================= CATEGORY SCHEMA ================= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Amazon Categories",
              url: "https://koloonline.online/categories",
              hasPart: categories.map((cat) => ({
                "@type": "Thing",
                name: cat,
                url: `https://koloonline.online/category/${cat}`
              }))
            })
          }}
        />
      </Head>

      {/* ================= HEADER ================= */}
      <div style={header}>
        🟠 Koloonline Categories
      </div>

      <p style={{ textAlign: "center", color: "#666" }}>
        Browse Amazon product categories and find best deals
      </p>

      {/* ================= GRID ================= */}
      <div style={grid}>
        {categories.map((cat) => (
          <Link key={cat} href={`/category/${cat}`}>

            <div style={card}>

              <div style={icon}>🛍️</div>

              <h3 style={title}>
                {cat.toUpperCase()}
              </h3>

              <p style={desc}>
                Explore best {cat} deals on Amazon
              </p>

            </div>

          </Link>
        ))}
      </div>

    </div>
  );
}

/* ================= STYLES ================= */

const header = {
  background: "#131921",
  color: "white",
  padding: 20,
  fontSize: 22,
  textAlign: "center",
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
  padding: 20,
  borderRadius: 12,
  textAlign: "center",
  cursor: "pointer",
  transition: "0.3s",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const icon = {
  fontSize: 30,
  marginBottom: 10,
};

const title = {
  fontSize: 16,
  fontWeight: "bold",
};

const desc = {
  fontSize: 12,
  color: "#777",
};
