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

  const isInitial = useRef(true);

  useEffect(() => {
    loadAnalytics();

    const interval = setInterval(() => {
      loadAnalytics(true);
    }, 60000); // optimized refresh

    return () => clearInterval(interval);
  }, []);

  /* ================= AI ENGINE ================= */
  function calculateAIScore(p) {
    const clicks = p.clicks || 0;
    const orders = p.orders || 0;
    const views = p.views || 0;

    const conversion = clicks ? orders / clicks : 0;

    const velocity = (clicks + orders) / 10;

    const engagement =
      views * 0.15 +
      clicks * 1.8 +
      orders * 10 +
      conversion * 120 +
      velocity;

    const viralBoost = p.viralBoost ? 50 : 0;

    return engagement + viralBoost;
  }

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
        const aiScore = calculateAIScore(p);

        const clicks = p.clicks || 0;
        const orders = p.orders || 0;

        return {
          ...p,
          aiScore,
          conversion: clicks ? ((orders / clicks) * 100).toFixed(1) : 0,
          isHot: aiScore > 80, // 🔥 upgraded threshold
          isViral: p.viralBoost || aiScore > 120,
        };
      });

      products.sort((a, b) => b.aiScore - a.aiScore);

      const bestProduct = products[0] || null;

      /* ================= BLOGS ================= */
      const blogSnap = await getDocs(collection(db, "blog"));

      const blogs = blogSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const autoBlogs = blogs.filter((b) => b.auto);
      const latestBlog = blogs[0] || null;

      /* ================= STATE ================= */
      setData({
        clicks: stats.totalClicks || 0,
        orders: stats.totalOrders || 0,
        revenue: (stats.totalOrders || 0) * 12,

        products,
        hot: products.filter((p) => p.isHot).length,
        viral: products.filter((p) => p.isViral).length,

        bestProduct,

        ctr:
          stats.totalViews && stats.totalClicks
            ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(2)
            : 0,
      });

      setBlogsData({
        total: blogs.length,
        auto: autoBlogs.length,
        latest: latestBlog,
      });

    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }

  /* ================= LOADING ================= */
  if (loading || !data) {
    return <div style={styles.loading}>Loading AI Dashboard...</div>;
  }

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        🧠 AI Analytics Dashboard
        <span style={styles.subHeader}>
          Autonomous Growth Intelligence v2
        </span>
      </div>

      {/* ================= CARDS ================= */}
      <div style={styles.grid}>
        <Card title="Clicks" value={data.clicks} color="#007bff" />
        <Card title="Orders" value={data.orders} color="#28a745" />
        <Card title="Revenue" value={`$${data.revenue}`} color="#ff9900" />
        <Card title="Hot" value={data.hot} color="#ff3b30" />
        <Card title="Viral" value={data.viral} color="#ff0066" />
      </div>

      {/* ================= BLOGS ================= */}
      {blogsData && (
        <div style={styles.insights}>
          <h3>📚 Blog System</h3>
          <p>📌 Total: {blogsData.total}</p>
          <p>🤖 Auto: {blogsData.auto}</p>
          <p>📰 Latest: {blogsData.latest?.title || "No blogs"}</p>
        </div>
      )}

      {/* ================= INSIGHTS ================= */}
      <div style={styles.insights}>
        <h3>🔥 Conversion Insights</h3>
        <p>📊 CTR: {data.ctr}%</p>
        <p>🏆 Best: <b>{data.bestProduct?.id || "N/A"}</b></p>
      </div>

      {/* ================= BEST PRODUCT ================= */}
      {data.bestProduct && (
        <div style={styles.bestBox}>
          <h3>🏆 Top AI Product</h3>
          <p>AI Score: {data.bestProduct.aiScore.toFixed(1)}</p>
          <p>Conversion: {data.bestProduct.conversion}%</p>
          <p>Status: {data.bestProduct.isViral ? "🔥 VIRAL" : "Normal"}</p>
        </div>
      )}

      {/* ================= TABLE ================= */}
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
              <span>
                {p.isViral ? "🔥 VIRAL" : p.isHot ? "🔥 HOT" : "Normal"}
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
