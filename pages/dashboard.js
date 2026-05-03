import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase-config";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();

    // 🔥 REAL TIME REFRESH (Amazon-style)
    const interval = setInterval(loadAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);

      /* ================= OVERVIEW ================= */
      const statsSnap = await getDoc(doc(db, "analytics", "overview"));
      const stats = statsSnap.exists() ? statsSnap.data() : {};

      /* ================= PRODUCTS ================= */
      const productsSnap = await getDocs(collection(db, "analytics_products"));

      let products = productsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      /* ================= AI SCORING ================= */
      products = products.map((p) => {
        const clicks = p.clicks || 0;
        const orders = p.orders || 0;
        const views = p.views || 0;

        const conversion = clicks > 0 ? orders / clicks : 0;

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

      /* ================= FINAL STATE ================= */
      setData({
        clicks: stats.totalClicks || 0,
        orders: stats.totalOrders || 0,
        whatsapp: stats.totalWhatsApp || 0,
        revenue: (stats.totalOrders || 0) * 12,

        products: products.slice(0, 10),
        totalProducts: products.length,
        hotProducts: products.filter(p => p.isHot).length,
      });

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return <div style={{ padding: 30 }}>Loading dashboard...</div>;
  }

  return (
    <div style={page}>

      {/* HEADER */}
      <div style={header}>
        🧠 Amazon-Level AI Analytics Dashboard
      </div>

      {/* STATS */}
      <div style={grid}>
        <Card title="Clicks" value={data.clicks} />
        <Card title="Orders" value={data.orders} />
        <Card title="Revenue $" value={data.revenue} />
        <Card title="Hot Products 🔥" value={data.hotProducts} />
      </div>

      {/* AI INSIGHTS */}
      <div style={insightBox}>
        <h3>🧠 AI Insights</h3>
        <p>📦 Total Products: {data.totalProducts}</p>
        <p>🔥 Hot Products: {data.hotProducts}</p>
        <p>📈 Conversion AI Active</p>
      </div>

      {/* PRODUCTS TABLE */}
      <div style={{ padding: 20 }}>
        <h2>🔥 Top AI Products</h2>

        <table style={table}>
          <thead>
            <tr style={thead}>
              <th>ID</th>
              <th>Clicks</th>
              <th>Orders</th>
              <th>Conversion %</th>
              <th>AI Score</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.products.map((p) => (
              <tr key={p.id} style={row}>
                <td>{p.id.slice(0, 6)}</td>
                <td>{p.clicks}</td>
                <td>{p.orders}</td>
                <td>{p.conversion}%</td>
                <td style={{ color: "#ff9900", fontWeight: "bold" }}>
                  {p.aiScore.toFixed(1)}
                </td>
                <td>
                  {p.isHot ? "🔥 HOT" : "Normal"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* ================= UI ================= */
function Card({ title, value }) {
  return (
    <div style={card}>
      <p>{title}</p>
      <h2 style={{ color: "#ff9900" }}>{value}</h2>
    </div>
  );
}

const page = {
  fontFamily: "Arial",
  background: "#f5f5f5",
  minHeight: "100vh",
};

const header = {
  background: "#131921",
  color: "white",
  padding: 20,
  textAlign: "center",
  fontSize: 22,
  fontWeight: "bold",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: 15,
  padding: 20,
};

const card = {
  background: "white",
  padding: 15,
  borderRadius: 10,
  textAlign: "center",
};

const insightBox = {
  margin: 20,
  padding: 15,
  background: "white",
  borderRadius: 10,
};

const table = {
  width: "100%",
  background: "white",
  borderRadius: 10,
};

const thead = {
  background: "#232f3e",
  color: "white",
};

const row = {
  textAlign: "center",
};
