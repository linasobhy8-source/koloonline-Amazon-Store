import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { buildSeoClusters } from "../../../lib/seo/aiSeoCluster";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // حماية لو مفيش دالة أو فيها خطأ
    if (typeof buildSeoClusters !== "function") {
      throw new Error("buildSeoClusters is not a function or missing import");
    }

    const clusters = buildSeoClusters(products);

    return res.status(200).json({
      success: true,
      clusters,
      totalClusters: clusters.length,
      totalProducts: products.length,
      meta: {
        level: 20,
        engine: "seo-cluster-ai",
      },
    });

  } catch (e) {
    console.error("SEO CLUSTER ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
