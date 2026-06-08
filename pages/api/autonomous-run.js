import { db } from "../../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

import { getMoneyProducts } from "../../lib/revenue-machine";

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // 💰 MONEY ENGINE
    products = getMoneyProducts(products);

    const top = products.slice(0, 20);

    // 🔁 feedback loop (learning)
    for (const p of top) {
      await updateDoc(doc(db, "products", p.id), {
        profitScore: p.profitScore || 0,
        brainScore: p.brainScore || 0,
        ctrMultiplier: p.ctrMultiplier || 1,
        lastOptimized: Date.now(),
      });
    }

    return res.status(200).json({
      success: true,
      top,
      message: "💰 Revenue Machine ACTIVE",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
