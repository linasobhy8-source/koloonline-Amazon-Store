import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

/* ================= SAFE ================= */
const num = (v) => Number(v) || 0;

/* ================= SCORE ================= */
function score(p) {
  const views = num(p.views);
  const clicks = num(p.clicks);
  const viral = p.viralBoost ? 50 : 0;

  return views + clicks * 2 + viral;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const trending = products
      .sort((a, b) => score(b) - score(a))
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      trending,
      meta: {
        total: products.length,
        engine: "lite-v1",
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
