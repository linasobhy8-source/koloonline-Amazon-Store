import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { revenueScore } from "../../ai/agents/revenue-agent";

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    products = products
      .map((p) => ({
        ...p,
        score: revenueScore(p),
      }))
      .sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      top: products.slice(0, 20),
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
