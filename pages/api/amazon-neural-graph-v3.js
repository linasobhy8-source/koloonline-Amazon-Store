import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= AMAZON NEURAL GRAPH V3 ================= */
export default async function handler(req, res) {
  try {
    const productsSnap = await getDocs(collection(db, "products"));
    const graphSnap = await getDocs(collection(db, "analytics/product_relations"));

    const graphMap = {};

    /* ================= LOAD GRAPH ================= */
    graphSnap.forEach((d) => {
      const data = d.data();

      graphMap[d.id] = {
        alsoViewed: Array.isArray(data.alsoViewed) ? data.alsoViewed : [],
        boughtTogether: Array.isArray(data.boughtTogether) ? data.boughtTogether : [],
      };
    });

    let updated = 0;
    let hot = 0;
    let cold = 0;

    /* ================= NEURAL SCORING ================= */
    for (const p of productsSnap.docs) {
      const product = p.data();
      const id = p.id;

      const graph = graphMap[id];

      const clicks = Number(product.clicks || 0);
      const orders = Number(product.orders || 0);
      const views = Number(product.views || 0);
      const rating = Number(product.rating || 3);
      const price = Number(product.price || 0);

      /* ================= 1. GRAPH NEURAL SIGNAL ================= */
      const graphSignal = graph
        ? (graph.alsoViewed.length * 1.5) +
          (graph.boughtTogether.length * 4)
        : 0;

      /* ================= 2. USER BEHAVIOR SIGNAL ================= */
      const behaviorSignal =
        clicks * 1.2 +
        orders * 5 +
        views * 0.25;

      /* ================= 3. PRODUCT QUALITY SIGNAL ================= */
      const qualitySignal =
        rating * 2 +
        (price > 0 && price < 30 ? 4 : 0);

      /* ================= 4. NEURAL FUSION MODEL ================= */
      let score =
        (graphSignal * 0.6) +
        (behaviorSignal * 0.3) +
        (qualitySignal * 0.1);

      /* ================= 5. MOMENTUM BOOST (TREND DETECTION) ================= */
      const momentum = clicks + orders * 3;

      if (momentum > 50) score *= 1.5;
      else if (momentum > 20) score *= 1.2;

      /* ================= 6. VIRAL NEURAL DETECTION ================= */
      const isHot = score > 18;
      const isCold = score < 5;

      if (isHot) hot++;
      if (isCold) cold++;

      /* ================= 7. AUTO RECOMMENDATION GRAPH ================= */
      const recommendations = graph
        ? [
            ...graph.alsoViewed,
            ...graph.boughtTogether,
          ]
        : [];

      const uniqueRecommendations = [...new Set(recommendations)].slice(0, 10);

      /* ================= 8. LABEL ENGINE ================= */
      let label = "normal";

      if (score > 20) label = "HOT";
      else if (score > 12) label = "RISING";
      else if (score < 5) label = "COLD";

      /* ================= UPDATE ================= */
      await updateDoc(doc(db, "products", id), {
        score,
        label,
        graphSignal,
        behaviorSignal,
        momentum,
        recommendations: uniqueRecommendations,
        lastNeuralUpdate: serverTimestamp(),
      });

      updated++;
    }

    return res.status(200).json({
      success: true,
      message: "🧠 Amazon Neural Graph V3 Completed",
      updated,
      hot,
      cold,
    });

  } catch (err) {
    console.error("Neural Graph Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
