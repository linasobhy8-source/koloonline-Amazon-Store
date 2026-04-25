import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

export default function Dashboard() {
  const [data, setData] = useState({
    totalClicks: 0,
    totalOrders: 0,
    totalWhatsApp: 0,
    topProducts: []
  });

  const getCountry = () => {
    const lang = navigator.language || "en-US";
    if (lang.includes("ar")) return "EG";
    if (lang.includes("en-CA")) return "CA";
    if (lang.includes("pl")) return "PL";
    return "US";
  };

  const trackEvent = (name, payload = {}) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", name, payload);
    }
  };

  useEffect(() => {
    trackEvent("dashboard_view", { country: getCountry() });
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      // 🔥 1. إجمالي الإحصائيات من Firestore
      const statsRef = doc(db, "analytics", "overview");
      const statsSnap = await getDoc(statsRef);

      // 🔥 2. أفضل المنتجات
      const productsSnap = await getDocs(collection(db, "analytics_products"));

      const topProducts = productsSnap.docs.map(doc => doc.data());

      if (statsSnap.exists()) {
        const stats = statsSnap.data();

        setData({
          totalClicks: stats.totalClicks || 0,
          totalOrders: stats.totalOrders || 0,
          totalWhatsApp: stats.totalWhatsApp || 0,
          topProducts: topProducts || []
        });
      }

    } catch (err) {
      console.log("Dashboard error:", err);
    }
  }

  const trackProduct = (asin) => {
    trackEvent("affiliate_click", {
      asin,
      source: "dashboard"
    });
  };

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{
        background: "#131921",
        color: "white",
        padding: 15,
        textAlign: "center"
      }}>
        📊 Koloonline Dashboard
      </div>

      {/* NAV */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 15,
        background: "#232f3e",
        padding: 10
      }}>
        <a href="/" style={{ color: "white" }}>Store</a>
        <a href="/dashboard" style={{ color: "white" }}>Dashboard</a>
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
        <Card title="Revenue" value={`$${data.totalOrders * 12}`} />

      </div>

      {/* TABLE */}
      <div style={{ padding: 20 }}>
        <table style={{ width: "100%", background: "white" }}>
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
                <tr
                  key={p.asin}
                  onClick={() => trackProduct(p.asin)}
                  style={{ cursor: "pointer", textAlign: "center" }}
                >
                  <td>{p.asin}</td>
                  <td>{p.clicks}</td>
                  <td>{p.orders}</td>
                  <td>{p.whatsapp}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 10,
      textAlign: "center"
    }}>
      <p>{title}</p>
      <h2 style={{ color: "#ff9900" }}>{value}</h2>
    </div>
  );
        }
