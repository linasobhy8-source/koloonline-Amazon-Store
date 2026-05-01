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
import { db } from "../config/firebase";
import Link from "next/link";
import { trackEvent } from "../lib/tracking";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [analyticsMap, setAnalyticsMap] = useState({});
  const [userBehavior, setUserBehavior] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [tab, setTab] = useState("trending");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsSnap = await getDocs(
          query(collection(db, "products"), limit(80))
        );

        const productsData = productsSnap.docs.map((doc) => ({
          id: doc.id,
          asin: doc.id,
          ...doc.data(),
        }));

        const analyticsSnap = await getDocs(
          collection(db, "analytics_products")
        );

        const map = {};
        analyticsSnap.docs.forEach((d) => {
          map[d.id] = d.data();
        });

        /* 🔥 USER BEHAVIOR (AI PERSONALIZATION) */
        const userId = "guest_1";
        const userSnap = await getDoc(doc(db, "user_behavior", userId));

        setUserBehavior(userSnap.exists() ? userSnap.data() : {});

        setProducts(productsData);
        setAnalyticsMap(map);

      } catch (err) {
        console.error("Fetch Error:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  /* ================= AI SCORE ================= */
  const filtered = useMemo(() => {
    const views = userBehavior.views || [];
    const clicks = userBehavior.clicks || [];
    const purchases = userBehavior.purchases || [];
    const categories = userBehavior.categories || [];

    return products
      .map((p) => {
        const analytics = analyticsMap[p.asin] || {};

        const clickCount = analytics.clicks || 0;
        const orderCount = analytics.orders || 0;
        const price = Number(p.price) || 0;

        let score =
          clickCount * 0.4 +
          orderCount * 2.5;

        /* 🔥 PERSONALIZATION AI */
        if (views.includes(p.asin)) score += 3;
        if (clicks.includes(p.asin)) score += 5;
        if (purchases.includes(p.asin)) score += 10;
        if (categories.includes(p.category)) score += 4;

        /* 💰 Price boost */
        if (price < 50) score += 4;
        if (price < 20) score += 3;

        /* 🚀 New products boost */
        if (!clickCount && !orderCount) score += 2;

        return {
          ...p,
          clicks: clickCount,
          orders: orderCount,
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
  }, [products, analyticsMap, userBehavior, search, category]);

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
        <title>Koloonline Amazon AI Pro</title>
      </Head>

      <header style={headerStyle}>
        🛒 Koloonline AI Amazon Store
      </header>

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

      <div style={tabsStyle}>
        <Tab label="🔥 AI Trending" active={tab==="trending"} onClick={()=>setTab("trending")} />
        <Tab label="💰 Best Sellers" active={tab==="bestsellers"} onClick={()=>setTab("bestsellers")} />
        <Tab label="⚡ Deals" active={tab==="deals"} onClick={()=>setTab("deals")} />
      </div>

      <div style={{ padding: 20 }}>
        {loading ? (
          <p>Loading AI Products...</p>
        ) : (
          <div style={gridStyle}>
            {active.map((p) => (
              <div key={p.id} style={cardStyle}>

                <img src={p.image || "/placeholder.png"} style={imgStyle} />

                <h3 style={titleStyle}>{p.title}</h3>

                <p style={priceStyle}>${p.price}</p>

                {p.score > 10 && <span style={topBadge}>⭐ AI Pick</span>}
                {p.orders > 3 && <span style={badge}>🔥 Best Seller</span>}
                {p.score > 15 && <span style={badge}>🚀 Hot Match</span>}

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
