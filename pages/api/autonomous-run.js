import { db } from "../../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

import { autonomousEngine } from "../../lib/autonomousEngine";
import {
  applyRevenueBoost,
  rankByRevenue
} from "../../lib/revenue-intelligence";

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));

    // 🧠 AI Engine
    products = autonomousEngine(products);

    // 💰 Revenue Engine (NEW)
    products = applyRevenueBoost(products);
    products = rankByRevenue(products);

    const top = products.slice(0, 20);

    // 💾 Save back to Firestore
    for (const p of top) {
      await updateDoc(doc(db, "products", p.id), {
        brainScore: p.brainScore || 0,
        revenueScore: p.revenueScore || 0,
        profitBoost: p.profitBoost || false,
        lastOptimized: Date.now()
      });
    }

    return res.status(200).json({
      success: true,
      top,
      message: "💰 Revenue AI System Active"
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message
    });
  }
}
