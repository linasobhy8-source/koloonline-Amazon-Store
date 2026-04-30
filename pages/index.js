import Head from "next/head";
import { useEffect, useState, useMemo } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Link from "next/link";
import { trackEvent } from "../lib/tracking";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [analyticsMap, setAnalyticsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [tab, setTab] = useState("trending");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /* 🔥 1. المنتجات */
        const productsSnap = await getDocs(
          query(collection(db, "products"), limit(80))
        );

        const productsData = productsSnap.docs.map((doc) => ({
          id: doc.id,
          asin: doc.id,
          ...doc.data(),
        }));

        /* 🔥 2. analytics مرة واحدة */
        const analyticsSnap = await getDocs(
          collection(db, "analytics_products")
        );

        const map = {};
        analyticsSnap.docs.forEach((d) => {
          map[d.id] = d.data();
        });

        setProducts(productsData);
        setAnalyticsMap(map);

      } catch (err) {
        console.error("Fetch Error:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  /* ================= FILTER + SCORE ================= */
  const filtered = useMemo(() => {
    return products
      .map((p) => {
        const analytics = analyticsMap[p.asin] || {};

        const clicks = analytics.clicks || 0;
        const orders = analytics.orders || 0;
        const price = Number(p.price) || 0;

        /* 🔥 SMART SCORE (محسن) */
        let score =
          clicks * 0.4 +
          orders * 2.5;

        /* 💰 سعر = boost */
        if (price < 50) score += 4;
        if (price < 20) score += 3;

        /* 🚀 منتجات جديدة */
        if (!clicks && !orders) score += 2;

        return {
          ...p,
          clicks,
          orders,
          score,
        };
      })
      .filter((p) => {
        const matchSearch =
          p.title?.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
          category === "all" || p.category === category;

        return matchSearch && matchCategory;
      });
  }, [products, analyticsMap, search, category]);

  /* ================= SORT ================= */
  const trending = [...filtered]
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  const bestSellers = [...filtered]
    .sort((a, b) => b.orders - a.orders)
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

      <Head>
        <title>Koloonline Amazon Pro</title>
      </Head>

      {/* HEADER */}
      <header style={headerStyle}>
        🛒 Koloonline Amazon Pro
      </header>

      {/* SEARCH */}
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

      {/* TABS */}
      <div style={tabsStyle}>
        <Tab label="🔥 Trending" active={tab==="trending"} onClick={()=>setTab("trending")} />
        <Tab label="💰 Best Sellers" active={tab==="bestsellers"} onClick={()=>setTab("bestsellers")} />
        <Tab label="⚡ Deals" active={tab==="deals"} onClick={()=>setTab("deals")} />
      </div>

      {/* PRODUCTS */}
      <div style={{ padding: 20 }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={gridStyle}>
            {active.map((p) => (
              <div key={p.id} style={cardStyle}>

                <img src={p.image || "/placeholder.png"} style={imgStyle} />

                <h3 style={titleStyle}>{p.title}</h3>

                <p style={priceStyle}>${p.price}</p>

                {/* BADGES */}
                {p.score > 10 && <span style={topBadge}>⭐ Top Rated</span>}
                {p.orders > 3 && <span style={badge}>🔥 Best Seller</span>}
                {p.score > 15 && <span style={badge}>🚀 Trending</span>}

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

/* UI */
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

/* STYLES */
const headerStyle = { background:"#131921", color:"white", padding:15 };
const searchBar = { display:"flex", gap:10, padding:10, background:"white" };
const inputStyle = { flex:1, padding:10 };
const tabsStyle = { display:"flex", gap:10, padding:10, background:"white" };
const gridStyle = { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:15 };
const cardStyle = { background:"white", padding:12, borderRadius:10 };
const imgStyle = { width:"100%", height:180, objectFit:"cover" };
const titleStyle = { fontSize:14, height:40, overflow:"hidden" };
const priceStyle = { color:"#B12704", fontWeight:"bold" };
const btnOrange = { width:"100%", padding:10, background:"#ff9900", border:"none", marginTop:8 };
const btnGreen = { width:"100%", padding:10, background:"#25D366", color:"white", border:"none", marginTop:8 };
const badge = { fontSize:10, background:"red", color:"white", padding:"2px 6px", borderRadius:5 };
const topBadge = { fontSize:10, background:"#007185", color:"white", padding:"2px 6px", borderRadius:5 };
