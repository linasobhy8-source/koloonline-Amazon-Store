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

      let topProducts = productsSnap.docs.map((doc) => ({
        asin: doc.id,
        ...doc.data(),
      }));

      // ترتيب حسب الأداء الحقيقي
      topProducts.sort(
        (a, b) =>
          (b.clicks || 0) + (b.orders || 0) * 3 -
          ((a.clicks || 0) + (a.orders || 0) * 3)
      );

      /* ================= SET STATE ================= */
      setData({
        totalClicks: stats.totalClicks || 0,
        totalOrders: stats.totalOrders || 0,
        totalWhatsApp: stats.totalWhatsApp || 0,

        // 💰 تقدير أرباح (قابل للتعديل)
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
    <div
      style={{
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#131921",
          color: "white",
          padding: 15,
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        📊 Koloonline Analytics Dashboard
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 15,
          padding: 20,
        }}
      >
        <Card title="Clicks" value={data.totalClicks} />
        <Card title="Orders" value={data.totalOrders} />
        <Card title="WhatsApp" value={data.totalWhatsApp} />
        <Card title="Revenue ($)" value={data.revenue} />
      </div>

      {/* TOP PRODUCTS */}
      <div style={{ padding: 20 }}>
        <h2>🔥 Top Performing Products</h2>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                background: "white",
                borderRadius: 10,
                overflow: "hidden",
                minWidth: 600,
              }}
            >
              <thead>
                <tr style={{ background: "#232f3e", color: "white" }}>
                  <th style={{ padding: 10 }}>ASIN</th>
                  <th>Clicks</th>
                  <th>Orders</th>
                  <th>WhatsApp</th>
                </tr>
              </thead>

              <tbody>
                {data.topProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", padding: 20 }}
                    >
                      No data yet
                    </td>
                  </tr>
                ) : (
                  data.topProducts.map((p) => (
                    <tr
                      key={p.asin}
                      style={{ textAlign: "center", borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: 10 }}>{p.asin}</td>
                      <td>{p.clicks || 0}</td>
                      <td>{p.orders || 0}</td>
                      <td>{p.whatsapp || 0}</td>
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
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 10,
        textAlign: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <p style={{ color: "#777", margin: 0 }}>{title}</p>
      <h2 style={{ color: "#ff9900", margin: 0 }}>{value}</h2>
    </div>
  );
          }
