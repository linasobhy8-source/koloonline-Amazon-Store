import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

/* ================= GRAPH AI SYSTEM ================= */
export default async function handler(req, res) {
  try {
    const productsSnap = await getDocs(collection(db, "products"));
    const graphSnap = await getDocs(collection(db, "analytics/product_relations"));

    const graphMap = {};

    /* ================= LOAD GRAPH ================= */
    graphSnap.forEach((d) => {
      const data = d.data();
      graphMap[d.id] = {
        alsoViewed: data.alsoViewed || [],
        boughtTogether: data.boughtTogether || [],
      };
    });

    let updated = 0;

    /* ================= PROCESS PRODUCTS ================= */
    for (const p of productsSnap.docs) {
      const product = p.data();
      const id = p.id;

      const graph = graphMap[id];

      if (!graph) continue;

      const alsoViewed = graph.alsoViewed;
      const boughtTogether = graph.boughtTogether;

      /* ================= GRAPH SCORE ENGINE ================= */
      let relationScore = 0;

      relationScore += alsoViewed.length * 2;
      relationScore += boughtTogether.length * 5;

      /* ================= AI BOOST ================= */
      const baseScore = product.score || 0;

      const newScore =
        baseScore +
        relationScore +
        (product.rating || 3) * 1.5;

      /* ================= RECOMMENDATION ENGINE ================= */
      const recommendations = [
        ...alsoViewed.slice(0, 5),
        ...boughtTogether.slice(0, 5),
      ];

      /* ================= UPDATE PRODUCT ================= */
      await updateDoc(doc(db, "products", id), {
        score: newScore,
        recommendations,
        graphBoost: relationScore,
        lastGraphUpdate: new Date(),
      });

      updated++;
    }

    return res.status(200).json({
      success: true,
      message: "🧠 Graph AI System Updated",
      updated,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
