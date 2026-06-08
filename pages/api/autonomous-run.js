import { db } from "../../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

import { masterRevenueBrain } from "../../lib/master-revenue-brain";
import { learnFromPerformance } from "../../lib/master-revenue-brain";

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // 🧠 MASTER AI BRAIN
    products = masterRevenueBrain(products);

    // 📊 learning layer
    products = learnFromPerformance(products);

    const top = products.slice(0, 20);

    // 💾 save intelligence back to Firestore
    for (const p of top) {
      await updateDoc(doc(db, "products", p.id), {
        aiScore: p.aiScore || 0,
        brainScore: p.brainScore || 0,
        finalScore: p.finalScore || 0,
        profitTier: p.profitTier,
        lastOptimized: Date.now(),
      });
    }

    return res.status(200).json({
      success: true,
      top,
      message: "🧠 Master Revenue Brain Active",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
