import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

export default function Dashboard() {
  const [data, setData] = useState({
    totalClicks: 0,
    totalOrders: 0,
    totalWhatsApp: 0,
    revenue: 0,
    topProducts: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);

      /* ================= OVERVIEW ================= */
      const statsRef = doc(db, "analytics", "overview");
      const statsSnap = await getDoc(statsRef);

      const stats = statsSnap.exists() ? statsSnap.data() : {};

      /* ================= PRODUCTS ANALYTICS ================= */
      const productsSnap = await getDocs(
        collection(db, "analytics_products")
      );

      let topProducts = productsSnap.docs.map((d) => ({
        asin: d.id,
        ...d.data(),
      }));

      /* ================= SMART SORT (AI GRAPH CORE) ================= */
      topProducts = topProducts
        .map((p) => {
          const clicks = p.clicks || 0;
          const orders = p.orders || 0;
          const whatsapp = p.whatsapp || 0;

          // AI performance score
          const score =
            clicks * 1 +
            orders * 4 +
            whatsapp * 2;

          return { ...p, score };
        })
        .sort((a, b) => b.score - a.score);

      /* ================= SET STATE ================= */
      setData({
        totalClicks: stats.totalClicks || 0,
        totalOrders: stats.totalOrders || 0,
        totalWhatsApp: stats.totalWhatsApp || 0,

        // 💰 revenue estimate (adjustable model)
        revenue: (stats.totalOrders || 0) * 10,

        topProducts: topProducts.slice(0, 10),
      });

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={header}>
        📊 Koloonline AI Graph Dashboard
      </div>

      {/* STATS CARDS */}
      <div style={grid}>
        <Card title="Clicks" value={data.totalClicks} />
        <Card title="Orders" value={data.totalOrders} />
        <Card title="WhatsApp" value={data.totalWhatsApp} />
        <Card title="Revenue ($)" value={data.revenue} />
      </div>

      {/* TOP PRODUCTS TABLE */}
      <div style={{ padding: 20 }}>
        <h2>🔥 AI Top Products</h2>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={thead}>
                  <th>ASIN</th>
                  <th>Clicks</th>
                  <th>Orders</th>
                  <th>WhatsApp</th>
                  <th>AI Score</th>
                </tr>
              </thead>

              <tbody>
                {data.topProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={empty}>
                      No analytics data yet
                    </td>
                  </tr>
                ) : (
                  data.topProducts.map((p) => (
                    <tr key={p.asin} style={row}>
                      <td>{p.asin}</td>
                      <td>{p.clicks || 0}</td>
                      <td>{p.orders || 0}</td>
                      <td>{p.whatsapp || 0}</td>
                      <td style={{ color: "#ff9900", fontWeight: "bold" }}>
                        {p.score?.toFixed(1)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

/* ================= CARD ================= */
function Card({ title, value }) {
  return (
    <div style={card}>
      <p style={{ margin: 0, color: "#777" }}>{title}</p>
      <h2 style={{ margin: 0, color: "#ff9900" }}>{value}</h2>
    </div>
  );
}

/* ================= STYLES ================= */
const header = {
  background: "#131921",
  color: "white",
  padding: 15,
  textAlign: "center",
  fontSize: 20,
  fontWeight: "bold",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: 15,
  padding: 20,
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 10,
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const tableStyle = {
  width: "100%",
  background: "white",
  borderRadius: 10,
  overflow: "hidden",
  minWidth: 600,
};

const thead = {
  background: "#232f3e",
  color: "white",
};

const row = {
  textAlign: "center",
  borderBottom: "1px solid #eee",
};

const empty = {
  textAlign: "center",
  padding: 20,
};
