import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import { autonomousEngine } from "../../lib/autonomousEngine";

// fallback safe function (بدل revenueOptimizer لو مش موجودة)
function revenueOptimizer(products = []) {
  try {
    if (!Array.isArray(products)) return [];

    return products.map((p) => ({
      ...p,
      revenueScore:
        (p.aiScore || 0) * 1.2 +
        (p.clicks || 0) * 0.5 +
        (p.views || 0) * 0.1,
    }));
  } catch (e) {
    console.error("revenueOptimizer error:", e);
    return products;
  }
}

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // 🧠 AI Ranking
    products = autonomousEngine(products || []);
    products = revenueOptimizer(products || []);

    // 🔥 Top 20 فقط
    const top = products.slice(0, 20);

    // 💾 تحديث Firestore (Auto Learning)
    for (const p of top) {
      if (!p?.id) continue;

      await updateDoc(doc(db, "products", p.id), {
        aiScore: p.aiScore || 0,
        revenueScore: p.revenueScore || 0,
        lastOptimized: Date.now(),
      });
    }

    return res.status(200).json({
      success: true,
      top,
      message: "Autonomous optimization complete",
    });
  } catch (e) {
    console.error("autonomous-run error:", e);

    return res.status(500).json({
      success: false,
      error: e.message || "Unknown error",
    });
  }
}
