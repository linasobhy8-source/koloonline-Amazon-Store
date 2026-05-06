import { useEffect, useState, useRef } from "react";
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
  const [blogsData, setBlogsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const firstLoad = useRef(true);

  useEffect(() => {
    loadAnalytics();

    // 🔥 بدل كل 15 ثانية reload كامل → خليه أهدى
    const interval = setInterval(() => {
      loadAnalytics(true);
    }, 60000); // كل دقيقة بدل 15 ثانية

    return () => clearInterval(interval);
  }, []);

  async function loadAnalytics(isRefresh = false) {
    try {
      if (!isRefresh) setLoading(true);

      /* ================= ANALYTICS ================= */
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

      const bestProduct = products[0];

      /* ================= BLOGS ================= */
      const blogSnap = await getDocs(collection(db, "blog"));

      const blogs = blogSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      const autoBlogs = blogs.filter(b => b.auto);
      const latestBlog = blogs[0];

      /* ================= UPDATE STATE ================= */
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

      setBlogsData({
        total: blogs.length,
        auto: autoBlogs.length,
        latest: latestBlog,
      });

    } catch (err) {
      console.error(err);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }

  if (loading || !data) {
    return <div style={styles.loading}>Loading AI Dashboard...</div>;
  }

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        🧠 AI Analytics Dashboard
        <span style={styles.subHeader}>
          Amazon-Level Conversion Intelligence System
        </span>
      </div>

      <div style={styles.grid}>
        <Card title="Clicks" value={data.clicks} color="#007bff" />
        <Card title="Orders" value={data.orders} color="#28a745" />
        <Card title="Revenue" value={`$${data.revenue}`} color="#ff9900" />
        <Card title="Hot Products" value={data.hot} color="#ff3b30" />
      </div>

      {blogsData && (
        <div style={styles.insights}>
          <h3>📚 Blog System</h3>
          <p>📌 Total Blogs: {blogsData.total}</p>
          <p>🤖 Auto Generated: {blogsData.auto}</p>
          <p>📰 Latest Blog: {blogsData.latest?.title || "No blogs yet"}</p>
        </div>
      )}

      <div style={styles.insights}>
        <h3>🔥 Conversion Insights</h3>
        <p>📊 CTR: {data.ctr}%</p>
        <p>🧠 Best Product: <b>{data.bestProduct?.id}</b></p>
      </div>

      {data.bestProduct && (
        <div style={styles.bestBox}>
          <h3>🏆 Top Product</h3>
          <p>AI Score: {data.bestProduct.aiScore.toFixed(1)}</p>
          <p>Conversion: {data.bestProduct.conversion}%</p>
        </div>
      )}

      <div style={styles.section}>
        <h2>🔥 Top Products</h2>

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
              <span>{p.isHot ? "🔥 HOT" : "Normal"}</span>
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
  },
  bestBox: {
    margin: "20px",
    padding: 15,
    background: "#fff7e6",
    borderLeft: "5px solid #ff9900",
    borderRadius: 10,
  },
  section: { padding: 20 },
  table: {
    background: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
    background: "#232f3e",
    color: "white",
    padding: 12,
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
  },
};
