import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

export default function Dashboard() {
  const [data, setData] = useState({
    totalClicks: 0,
    totalOrders: 0,
    totalWhatsApp: 0,
    revenue: 0,
    topProducts: []
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

      /* ================= PRODUCTS ================= */
      const productsSnap = await getDocs(collection(db, "analytics_products"));

      let topProducts = productsSnap.docs.map((doc) => ({
        asin: doc.id,
        ...doc.data()
      }));

      // 🔥 ترتيب حسب clicks (مهم جدًا)
      topProducts.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));

      /* ================= SET DATA ================= */
      setData({
        totalClicks: stats.totalClicks || 0,
        totalOrders: stats.totalOrders || 0,
        totalWhatsApp: stats.totalWhatsApp || 0,
        revenue: (stats.totalOrders || 0) * 12,
        topProducts
      });

    } catch (err) {
      console.log("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{
        background: "#131921",
        color: "white",
        padding: 15,
        textAlign: "center",
        fontSize: 20
      }}>
        📊 Koloonline Analytics Dashboard
      </div>

      {/* STATS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        gap: 15,
        padding: 20
      }}>
        <Card title="Clicks" value={data.totalClicks} />
        <Card title="Orders" value={data.totalOrders} />
        <Card title="WhatsApp" value={data.totalWhatsApp} />
        <Card title="Revenue" value={`$${data.revenue}`} />
      </div>

      {/* TOP PRODUCTS */}
      <div style={{ padding: 20 }}>
        <h2>🔥 Top Products</h2>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <table style={{
            width: "100%",
            background: "white",
            borderRadius: 10,
            overflow: "hidden"
          }}>
            <thead>
              <tr style={{ background: "#232f3e", color: "white" }}>
                <th>ASIN</th>
                <th>Clicks</th>
                <th>Orders</th>
                <th>WhatsApp</th>
              </tr>
            </thead>

            <tbody>
              {data.topProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: 20 }}>
                    No data yet
                  </td>
                </tr>
              ) : (
                data.topProducts.map((p) => (
                  <tr key={p.asin} style={{ textAlign: "center" }}>
                    <td>{p.asin}</td>
                    <td>{p.clicks || 0}</td>
                    <td>{p.orders || 0}</td>
                    <td>{p.whatsapp || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

/* ================= CARD ================= */
function Card({ title, value }) {
  return (
    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 10,
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <p style={{ color: "#777" }}>{title}</p>
      <h2 style={{ color: "#ff9900" }}>{value}</h2>
    </div>
  );
        }
