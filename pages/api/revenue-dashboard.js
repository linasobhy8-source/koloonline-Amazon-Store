import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

const n = (v) => Number(v) || 0;

/* ================= CALC ================= */
function calc(p) {
  const views = n(p.views);
  const clicks = n(p.clicks);
  const orders = n(p.orders);
  const price = n(p.price);

  const revenue = orders * price;
  const ctr = views ? clicks / views : 0;
  const cvr = clicks ? orders / clicks : 0;

  const score = revenue * 20 + ctr * 500 + cvr * 1200 + views * 0.2;

  return { revenue, ctr, cvr, score };
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    let totalRevenue = 0;
    let totalScore = 0;

    const ranked = products.map((p) => {
      const r = calc(p);

      totalRevenue += r.revenue;
      totalScore += r.score;

      return {
        id: p.id,
        title: p.title,
        ...r,
        views: n(p.views),
        clicks: n(p.clicks),
      };
    });

    return res.status(200).json({
      success: true,

      overview: {
        products: products.length,
        revenue: Number(totalRevenue.toFixed(2)),
        score: Number(totalScore.toFixed(2)),
      },

      topProducts: ranked
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),

      status:
        totalRevenue > 100
          ? "scaling"
          : totalRevenue > 20
          ? "growing"
          : "early",
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
