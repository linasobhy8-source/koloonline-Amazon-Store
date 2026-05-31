import { db } from "../../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

import { autonomousEngine } from "../../lib/autonomousEngine";
import { revenueOptimizer } from "../../lib/revenueOptimizer";

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    // 🧠 AI Ranking
    products = autonomousEngine(products);
    products = revenueOptimizer(products);

    // 🔥 Top 20 فقط
    const top = products.slice(0, 20);

    // 💾 تحديث Firestore (Auto Learning)
    for (const p of top) {
      await updateDoc(doc(db, "products", p.id), {
        aiScore: p.aiScore,
        revenueScore: p.revenueScore || 0,
        lastOptimized: Date.now()
      });
    }

    return res.status(200).json({
      success: true,
      top,
      message: "Autonomous optimization complete"
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message
    });
  }
}
