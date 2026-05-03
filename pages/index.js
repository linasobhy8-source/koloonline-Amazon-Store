import Head from "next/head";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../config/firebase";
import Link from "next/link";

const fallbackImage = "https://via.placeholder.com/300";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(
        query(collection(db, "products"), limit(50))
      );

      setProducts(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div style={{ background: "#eaeded" }}>

      {/* SEO */}
      <Head>
        <title>Koloonline - Amazon Deals</title>
        <meta name="description" content="Best Amazon affiliate deals in Electronics, Fashion, Home & Sports" />
      </Head>

      {/* HEADER */}
      <header style={header}>
        🟠 Koloonline Amazon Deals
      </header>

      {/* SEARCH */}
      <div style={{ padding: 10 }}>
        <input
          placeholder="Search Amazon products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchBox}
        />
      </div>

      {/* CATEGORIES */}
      <div style={cats}>
        {["Electronics", "Fashion", "Home", "Sports"].map((c) => (
          <button key={c} style={catBtn}>
            {c}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div style={grid}>
        {filtered.map((p) => (
          <div key={p.id} style={card}>
            
            <img
              src={p.image || fallbackImage}
              style={img}
            />

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

/* ===== STYLE ===== */

const header = {
  background: "#131921",
  color: "white",
  padding: 15,
  fontSize: 22,
  textAlign: "center",
};

const searchBox = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
};

const cats = {
  display: "flex",
  gap: 10,
  padding: 10,
  flexWrap: "wrap",
};

const catBtn = {
  padding: 10,
  background: "#ff9900",
  border: "none",
  borderRadius: 6,
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
  background: "#25D366",
  border: "none",
  color: "white",
  marginTop: 5,
};
