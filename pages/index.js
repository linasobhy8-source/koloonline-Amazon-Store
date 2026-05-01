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

/* صورة احتياطية */
const fallbackImage =
  "https://via.placeholder.com/300x300?text=No+Image";

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

  /* ================= AI ================= */
  const filtered = useMemo(() => {
    return products
      .map((p) => {
        const analytics = analyticsMap[p.asin] || {};

        let score =
          (analytics.clicks || 0) * 0.4 +
          (analytics.orders || 0) * 2;

        if ((Number(p.price) || 0) < 50) score += 3;

        return { ...p, score };
      })
      .filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      );
  }, [products, analyticsMap, search]);

  const active = [...filtered]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return (
    <div style={{ background: "#eaeded" }}>

      <Head>
        <title>Koloonline Store</title>
      </Head>

      <h1 style={{ padding: 15 }}>🛒 Koloonline</h1>

      <div style={{ padding: 10 }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 10, width: "100%" }}
        />
      </div>

      <div style={{ padding: 20 }}>
        {loading ? (
          <p>Loading...</p>
        ) : active.length === 0 ? (
          <p>❌ No products found</p>
        ) : (
          <div style={gridStyle}>
            {active.map((p) => (
              <div key={p.id} style={cardStyle}>

                <img
                  src={p.image || fallbackImage}
                  onError={(e) => {
                    e.target.src = fallbackImage;
                  }}
                  loading="lazy"
                  style={imgStyle}
                />

                <h3 style={titleStyle}>{p.title}</h3>

                <p style={priceStyle}>${p.price}</p>

                <Link href={`/product/${p.asin}`}>
                  <button
                    onClick={() => trackEvent("click", p)}
                    style={btnOrange}
                  >
                    View
                  </button>
                </Link>

                <button
                  onClick={() => {
                    trackEvent("order", p);
                    window.open(p.link, "_blank");
                  }}
                  style={btnGreen}
                >
                  Buy
                </button>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* STYLE */
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 15,
};

const cardStyle = {
  background: "white",
  padding: 10,
  borderRadius: 10,
};

const imgStyle = {
  width: "100%",
  height: 180,
  objectFit: "cover",
};

const titleStyle = {
  fontSize: 14,
  height: 40,
  overflow: "hidden",
};

const priceStyle = {
  color: "#B12704",
  fontWeight: "bold",
};

const btnOrange = {
  width: "100%",
  padding: 10,
  background: "#ff9900",
  border: "none",
  marginTop: 5,
};

const btnGreen = {
  width: "100%",
  padding: 10,
  background: "#25D366",
  color: "white",
  border: "none",
  marginTop: 5,
};
