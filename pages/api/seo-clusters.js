import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { buildSeoClusters } from "@/lib/seo/aiSeoCluster";

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const clusters = buildSeoClusters(products);

    return res.status(200).json({
      success: true,
      clusters,
      totalClusters: clusters.length,
      totalProducts: products.length,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
