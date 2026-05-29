import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  limit,
} from "firebase/firestore";

function score(p) {
  return (
    (p.views || 0) +
    (p.clicks || 0) * 2 +
    (p.orders || 0) * 5 +
    (p.viralBoost ? 100 : 0)
  );
}

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= AI RANKING ================= */
    products = products
      .sort((a, b) => score(b) - score(a))
      .slice(0, 20);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
