import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= MAIN DASHBOARD ================= */
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);

      const statsSnap = await getDoc(doc(db, "analytics", "overview"));
      const stats = statsSnap.exists() ? statsSnap.data() : {};

      const productsSnap = await getDocs(collection(db, "analytics_products"));

      let products = productsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      products = products.map((p) => {
        const clicks = p.clicks || 0;
        const orders = p.orders || 0;
        const views = p.views || 0;

        const conversion = clicks ? orders / clicks : 0;

        const aiScore =
          views * 0.2 +
          clicks * 1.5 +
          orders * 8 +
          conversion * 100;

        return {
          ...p,
          conversion: (conversion * 100).toFixed(1),
          aiScore,
          isHot: aiScore > 50,
        };
      });

      products.sort((a, b) => b.aiScore - a.aiScore);

      /* ================= 🔥 HIGH CONVERSION INSIGHTS ================= */
      const bestProduct = products[0];

      setData({
        clicks: stats.totalClicks || 0,
        orders: stats.totalOrders || 0,
        revenue: (stats.totalOrders || 0) * 12,
        products,
        hot: products.filter((p) => p.isHot).length,
        bestProduct,
        ctr: stats.totalClicks && stats.totalViews
          ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(2)
          : 0,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return <div style={styles.loading}>Loading AI Dashboard...</div>;
  }

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        🧠 AI Analytics Dashboard
        <span style={styles.subHeader}>
          Amazon-Level Conversion Intelligence System
        </span>
      </div>

      {/* STATS */}
      <div style={styles.grid}>
        <Card title="Clicks" value={data.clicks} color="#007bff" />
        <Card title="Orders" value={data.orders} color="#28a745" />
        <Card title="Revenue" value={`$${data.revenue}`} color="#ff9900" />
        <Card title="Hot Products" value={data.hot} color="#ff3b30" />
      </div>

      {/* 🔥 CONVERSION INSIGHT (NEW) */}
      <div style={styles.insights}>
        <h3>🔥 Conversion Insights</h3>
        <p>📊 CTR: {data.ctr}%</p>

        <p>
          🧠 Best Product:
          <b> {data.bestProduct?.id}</b>
        </p>

        <p>⚡ AI auto-ranking active</p>
        <p>🚀 Real-time optimization enabled</p>
      </div>

      {/* 🔥 BEST PRODUCT CARD */}
      {data.bestProduct && (
        <div style={styles.bestBox}>
          <h3>🏆 Top Converting Product</h3>
          <p>ID: {data.bestProduct.id}</p>
          <p>AI Score: {data.bestProduct.aiScore.toFixed(1)}</p>
          <p>Conversion: {data.bestProduct.conversion}%</p>
        </div>
      )}

      {/* PRODUCTS */}
      <div style={styles.section}>
        <h2>🔥 Top Performing Products</h2>

        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>ID</span>
            <span>Clicks</span>
            <span>Orders</span>
            <span>Conv%</span>
            <span>AI Score</span>
            <span>Status</span>
          </div>

          {data.products.slice(0, 10).map((p) => (
            <div key={p.id} style={styles.row}>
              <span>{p.id.slice(0, 6)}</span>
              <span>{p.clicks}</span>
              <span>{p.orders}</span>
              <span>{p.conversion}%</span>
              <span style={{ color: "#ff9900", fontWeight: "bold" }}>
                {p.aiScore.toFixed(1)}
              </span>
              <span>
                {p.isHot ? "🔥 HOT" : "Normal"}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ================= CARD ================= */
function Card({ title, value, color }) {
  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${color}` }}>
      <p style={{ margin: 0, color: "#666" }}>{title}</p>
      <h2 style={{ margin: 0, color }}>{value}</h2>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    fontFamily: "Arial",
    background: "#f4f6f9",
    minHeight: "100vh",
    paddingBottom: 40,
  },

  header: {
    background: "#111827",
    color: "white",
    padding: 20,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },

  subHeader: {
    display: "block",
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: 15,
    padding: 20,
  },

  card: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  },

  insights: {
    margin: "0 20px",
    padding: 15,
    background: "white",
    borderRadius: 10,
    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
  },

  bestBox: {
    margin: "20px",
    padding: 15,
    background: "#fff7e6",
    borderLeft: "5px solid #ff9900",
    borderRadius: 10,
  },

  section: {
    padding: 20,
  },

  table: {
    background: "white",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
    background: "#232f3e",
    color: "white",
    padding: 12,
    fontWeight: "bold",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
    padding: 12,
    borderBottom: "1px solid #eee",
  },

  loading: {
    padding: 40,
    textAlign: "center",
    fontSize: 18,
  },
};
