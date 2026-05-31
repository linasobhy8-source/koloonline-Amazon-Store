import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { buildSeoClusters } from "../../../lib/seo/aiSeoCluster";

export default async function handler(req, res) {
  // ================= METHOD GUARD =================
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    // ================= FETCH PRODUCTS =================
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // ================= SAFE DEFAULT =================
    const safeProducts = Array.isArray(products) ? products : [];

    // ================= VALIDATION =================
    if (typeof buildSeoClusters !== "function") {
      throw new Error("buildSeoClusters is not a valid function (check aiSeoCluster export)");
    }

    // ================= ENGINE EXECUTION =================
    const clusters = buildSeoClusters(safeProducts);

    const safeClusters = Array.isArray(clusters) ? clusters : [];

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      clusters: safeClusters,
      stats: {
        totalClusters: safeClusters.length,
        totalProducts: safeProducts.length,
      },
      meta: {
        level: 20,
        engine: "seo-cluster-ai",
        timestamp: Date.now(),
      },
    });

  } catch (e) {
    console.error("SEO CLUSTER ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e?.message || "Internal Server Error",
    });
  }
}
