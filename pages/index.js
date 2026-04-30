import Head from "next/head";
import { useEffect, useState, useMemo } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import Link from "next/link";
import { trackEvent } from "../lib/tracking";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [tab, setTab] = useState("trending");

  /* ================= FETCH + ANALYTICS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), limit(80));
      const snap = await getDocs(q);

      const data = await Promise.all(
        snap.docs.map(async (docItem) => {
          const product = {
            id: docItem.id,
            asin: docItem.id,
            ...docItem.data(),
          };

          /* 🔥 جلب analytics */
          try {
            const ref = doc(db, "analytics_products", product.asin);
            const analytics = await getDoc(ref);

            if (analytics.exists()) {
              const a = analytics.data();
              product.clicks = a.clicks || 0;
              product.orders = a.orders || 0;
            } else {
              product.clicks = 0;
              product.orders = 0;
            }
          } catch {
            product.clicks = 0;
            product.orders = 0;
          }

          /* 🔥 SMART SCORE */
          const price = Number(product.price) || 0;

          let score =
            product.clicks * 0.5 +
            product.orders * 1.5;

          if (price < 50) score += 5;
          if (price < 20) score += 3;

          product.score = score;

          return product;
        })
      );

      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.title?.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        category === "all" || p.category === category;

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  /* ================= SMART RANKING ================= */

  const trending = [...filtered]
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  const bestSellers = [...filtered]
    .sort((a, b) => (b.orders || 0) - (a.orders || 0))
    .slice(0, 12);

  const deals = [...filtered]
    .filter((p) => Number(p.price) < 50)
    .sort((a, b) => a.price - b.price)
    .slice(0, 12);

  const active =
    tab === "trending"
      ? trending
      : tab === "bestsellers"
      ? bestSellers
      : deals;

  return (
    <div style={{ fontFamily: "Arial", background: "#eaeded" }}>

      {/* ================= SEO ================= */}
      <Head>
        <title>Koloonline Amazon Pro | Deals & Smart Shopping</title>

        <meta
          name="description"
          content="Amazon affiliate store with trending products and best deals."
        />

        <meta property="og:title" content="Koloonline Amazon Store" />
        <meta property="og:image" content="https://i.postimg.cc/9fVfC1Y4/1000276862.png" />
        <meta property="og:url" content="https://koloonline.online" />

        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* ================= HEADER ================= */}
      <header style={headerStyle}>
        🛒 Koloonline Amazon Pro
      </header>

      {/* ================= SEARCH ================= */}
      <div style={searchBar}>
        <input
          placeholder="Search Amazon products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
        </select>
      </div>

      {/* ================= TABS ================= */}
      <div style={tabsStyle}>
        <Tab label="🔥 Trending" active={tab==="trending"} onClick={()=>setTab("trending")} />
        <Tab label="💰 Best Sellers" active={tab==="bestsellers"} onClick={()=>setTab("bestsellers")} />
        <Tab label="⚡ Deals" active={tab==="deals"} onClick={()=>setTab("deals")} />
      </div>

      {/* ================= PRODUCTS ================= */}
      <div style={{ padding: 20 }}>
        {loading ? (
          <p>Loading Amazon products...</p>
        ) : (
          <div style={gridStyle}>
            {active.map((p) => (
              <div key={p.id} style={cardStyle}>

                <img src={p.image || "/placeholder.png"} style={imgStyle} />

                <h3 style={titleStyle}>{p.title}</h3>

                <p style={priceStyle}>${p.price}</p>

                {/* 🔥 SMART BADGES */}
                {p.score > 8 && <span style={topBadge}>⭐ Top Rated</span>}
                {p.orders > 3 && <span style={badge}>🔥 Best Seller</span>}
                {p.score > 12 && <span style={badge}>🚀 Trending</span>}

                <Link href={`/product/${p.asin}`}>
                  <button
                    onClick={() => trackEvent("click", p)}
                    style={btnOrange}
                  >
                    View Product
                  </button>
                </Link>

                <button
                  onClick={() => {
                    trackEvent("order", p);
                    window.open(p.link, "_blank");
                  }}
                  style={btnGreen}
                >
                  Buy on Amazon
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

/* ================= TAB ================= */
function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 15px",
        border: "none",
        cursor: "pointer",
        background: active ? "#ff9900" : "#eee",
        fontWeight: "bold",
        borderRadius: 5,
      }}
    >
      {label}
    </button>
  );
}

/* ================= STYLES ================= */
const headerStyle = {
  background: "#131921",
  color: "white",
  padding: 15,
  fontSize: 22,
  fontWeight: "bold",
};

const searchBar = {
  display: "flex",
  gap: 10,
  padding: 10,
  background: "white",
};

const inputStyle = {
  flex: 1,
  padding: 10,
  borderRadius: 5,
};

const tabsStyle = {
  display: "flex",
  gap: 10,
  padding: 10,
  background: "white",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
  gap: 15,
};

const cardStyle = {
  background: "white",
  padding: 12,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const imgStyle = {
  width: "100%",
  height: 180,
  objectFit: "cover",
  borderRadius: 8,
};

const titleStyle = {
  fontSize: 14,
  height: 40,
  overflow: "hidden",
};

const priceStyle = {
  fontWeight: "bold",
  color: "#B12704",
};

const btnOrange = {
  width: "100%",
  padding: 10,
  background: "#ff9900",
  border: "none",
  marginTop: 8,
  cursor: "pointer",
};

const btnGreen = {
  width: "100%",
  padding: 10,
  background: "#25D366",
  color: "white",
  border: "none",
  marginTop: 8,
  cursor: "pointer",
};

const badge = {
  display: "inline-block",
  fontSize: 10,
  background: "#ff0000",
  color: "white",
  padding: "2px 6px",
  borderRadius: 5,
  marginBottom: 5,
};

const topBadge = {
  display: "inline-block",
  fontSize: 10,
  background: "#007185",
  color: "white",
  padding: "2px 6px",
  borderRadius: 5,
  marginBottom: 5,
};
