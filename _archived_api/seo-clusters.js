import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { buildSeoClusters } from "../../../lib/seo/aiSeoCluster";

export default async function handler(req, res) {
  // Allow only GET
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

    // ================= VALIDATION =================
    if (!Array.isArray(products)) {
      throw new Error("Invalid products data");
    }

    if (typeof buildSeoClusters !== "function") {
      throw new Error("SEO engine missing: buildSeoClusters not found");
    }

    // ================= BUILD CLUSTERS =================
    const clusters = buildSeoClusters(products);

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      clusters,
      stats: {
        totalClusters: clusters?.length || 0,
        totalProducts: products.length,
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
      error: e?.message || "Unknown error",
    });
  }
}
