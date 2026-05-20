import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

function score(p) {
  return (p.rating || 4) * 2 + (p.views || 0) * 0.01;
}

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const ranked = products
      .map((p) => ({
        ...p,
        score: score(p),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.status(200).json({
      topPicks: ranked,
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
