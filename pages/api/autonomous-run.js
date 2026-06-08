import { db } from "../../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

import { autonomousEngine } from "../../lib/autonomousEngine";
import { revenueEngine } from "../../lib/revenueEngine";

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // 🧠 AI ranking layer
    products = autonomousEngine(products);

    // 💰 revenue optimization layer (NEW)
    products = revenueEngine(products);

    const top = products.slice(0, 20);

    // 💾 save learning back to Firestore
    for (const p of top) {
      await updateDoc(doc(db, "products", p.id), {
        aiScore: p.aiScore || 0,
        revenueScore: p.revenueScore || 0,
        ctr: p.ctr || 0,
        lastOptimized: Date.now(),
      });
    }

    return res.status(200).json({
      success: true,
      top,
      message: "Revenue engine activated",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
