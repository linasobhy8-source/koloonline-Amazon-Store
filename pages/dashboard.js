import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= AI CORE ================= */

/* AI SCORE */
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

  return engagement + (p.viralBoost ? 50 : 0);
}

/* 💰 REVENUE ENGINE (IMPORTANT) */
function revenueScore(p) {
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;
  const price = p.price || 10;

  const conversion = clicks ? orders / clicks : 0;

  return orders * price * conversion;
}

/* 🧠 DECISION ENGINE */
function makeDecision(p) {
  if (p.revenue > 500) return "PROMOTE";
  if (p.revenue > 200) return "BOOST";
  if (p.revenue < 80) return "PAUSE";
  return "NORMAL";
}

/* 🧠 MEMORY LOOP */
async function logMemory(productId, action) {
  await setDoc(doc(db, "ai_memory", productId), {
    action,
    timestamp: Date.now(),
  });
}

/* ================= MAIN DASHBOARD ================= */
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ================= */
  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);

    try {
      const statsSnap = await getDoc(doc(db, "analytics", "overview"));
      const stats = statsSnap.exists() ? statsSnap.data() : {};

      const productsSnap = await getDocs(
        collection(db, "analytics_products")
      );

      let products = productsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      /* ================= AI PIPELINE ================= */
      products = products.map((p) => {
        const aiScore = calculateAIScore(p);
        const revenue = revenueScore(p);

        const enhanced = {
          ...p,
          aiScore,
          revenue,
          isHot: aiScore > 80,
          isViral: aiScore > 120,
        };

        enhanced.decision = makeDecision(enhanced);

        return enhanced;
      });

      /* ================= AUTO SORT BY REVENUE ================= */
      products.sort((a, b) => b.revenue - a.revenue);

      /* ================= AUTO-LEARNING LOOP ================= */
      for (const p of products.slice(0, 5)) {
        await logMemory(p.id, p.decision);
      }

      const bestProduct = products[0] || null;

      setData({
        clicks: stats.totalClicks || 0,
        orders: stats.totalOrders || 0,
        revenue: (stats.totalOrders || 0) * 12,

        products,
        bestProduct,

        hot: products.filter((p) => p.isHot).length,
        viral: products.filter((p) => p.isViral).length,
      });
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  }

  /* ================= AUTOPILOT ================= */
  async function autopilot(product) {
    if (product.decision === "PROMOTE") {
      await addDoc(collection(db, "autopilot_actions"), {
        productId: product.id,
        action: "BOOST_ADS",
        timestamp: Date.now(),
      });
    }

    if (product.decision === "PAUSE") {
      await addDoc(collection(db, "autopilot_actions"), {
        productId: product.id,
        action: "STOP_MARKETING",
        timestamp: Date.now(),
      });
    }
  }

  /* ================= UI ================= */
  if (loading || !data) {
    return <div style={{ padding: 40 }}>Loading Autonomous OS...</div>;
  }

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>🧠 Autonomous Revenue OS v5</h1>

      {/* ================= STATS ================= */}
      <div style={{ display: "flex", gap: 20 }}>
        <div>Clicks: {data.clicks}</div>
        <div>Orders: {data.orders}</div>
        <div>Revenue: ${data.revenue}</div>
        <div>Hot: {data.hot}</div>
        <div>Viral: {data.viral}</div>
      </div>

      {/* ================= BEST PRODUCT ================= */}
      {data.bestProduct && (
        <div style={{ marginTop: 20, padding: 10, background: "#fff3cd" }}>
          <h3>🏆 Best Product</h3>
          <p>Revenue: {data.bestProduct.revenue.toFixed(2)}</p>
          <p>Decision: {data.bestProduct.decision}</p>
        </div>
      )}

      {/* ================= PRODUCTS ================= */}
      <h2 style={{ marginTop: 20 }}>🔥 Revenue Engine Ranking</h2>

      {data.products.slice(0, 10).map((p) => (
        <div
          key={p.id}
          style={{
            padding: 10,
            marginBottom: 10,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        >
          <h4>{p.id}</h4>

          <p>Revenue: ${p.revenue.toFixed(2)}</p>
          <p>AI Score: {p.aiScore.toFixed(2)}</p>
          <p>Decision: {p.decision}</p>

          <button
            onClick={() => autopilot(p)}
            style={{
              padding: 8,
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Run Autopilot
          </button>
        </div>
      ))}
    </div>
  );
    }
