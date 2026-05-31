import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= LEVEL 8 AUTONOMOUS ENGINE ================= */

export async function autonomousRevenueEngine() {
  const snap = await getDocs(collection(db, "products"));

  let products = snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

  /* ================= AUTO INJECTION ================= */
  if (products.length < 10) {
    const seedProducts = generateSeedProducts();

    for (const p of seedProducts) {
      await setDoc(doc(db, "products", p.id), p);
    }

    products = [...products, ...seedProducts];
  }

  /* ================= TREND PREDICTION ================= */
  products = products.map(p => {
    const views = p.views || 0;
    const clicks = p.clicks || 0;
    const orders = p.orders || 0;

    const ctr = views ? clicks / views : 0;
    const conv = clicks ? orders / clicks : 0;

    const trendScore =
      views * 0.3 +
      clicks * 1.5 +
      orders * 5 +
      ctr * 120 +
      conv * 180 +
      (p.viralBoost ? 100 : 0);

    const revenueForecast = orders * (p.price || 10);

    return {
      ...p,
      trendScore,
      revenueForecast
    };
  });

  /* ================= SORT BY REVENUE POTENTIAL ================= */
  products.sort((a, b) => b.trendScore - a.trendScore);

  /* ================= SAVE TOP PERFORMERS ================= */
  const top = products.slice(0, 10);

  await setDoc(doc(db, "analytics", "top_products"), {
    updatedAt: Date.now(),
    top
  });

  return {
    totalProducts: products.length,
    top,
    totalForecastRevenue: top.reduce((sum, p) => sum + (p.revenueForecast || 0), 0)
  };
}

/* ================= AUTO SEED SYSTEM ================= */
function generateSeedProducts() {
  return [
    {
      id: "auto-1",
      title: "AI Smart Watch Pro",
      price: 49,
      views: 1200,
      clicks: 300,
      orders: 60,
      viralBoost: true,
      category: "electronics"
    },
    {
      id: "auto-2",
      title: "Wireless Earbuds X",
      price: 29,
      views: 900,
      clicks: 250,
      orders: 40,
      category: "electronics"
    },
    {
      id: "auto-3",
      title: "Fitness Tracker Band",
      price: 19,
      views: 1500,
      clicks: 400,
      orders: 80,
      category: "health"
    }
  ];
}
