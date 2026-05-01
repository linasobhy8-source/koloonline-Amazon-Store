import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

async function logCron(data) {
  try {
    await addDoc(collection(db, "cron_logs"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (e) {}
}

export default async function handler(req, res) {
  let updated = 0;

  try {
    const productsSnap = await getDocs(collection(db, "products"));
    const graphSnap = await getDocs(collection(db, "analytics/product_relations"));

    const graphMap = {};

    graphSnap.forEach((d) => {
      const data = d.data();
      graphMap[d.id] = {
        alsoViewed: data.alsoViewed || [],
        boughtTogether: data.boughtTogether || [],
      };
    });

    for (const p of productsSnap.docs) {
      const product = p.data();
      const id = p.id;
      const graph = graphMap[id];

      if (!graph) continue;

      const relationScore =
        graph.alsoViewed.length * 2 +
        graph.boughtTogether.length * 5;

      const newScore =
        (product.score || 0) +
        relationScore +
        (product.rating || 3) * 1.5;

      const recommendations = [
        ...graph.alsoViewed.slice(0, 5),
        ...graph.boughtTogether.slice(0, 5),
      ];

      await updateDoc(doc(db, "products", id), {
        score: newScore,
        recommendations,
        graphBoost: relationScore,
        lastGraphUpdate: new Date(),
      });

      updated++;
    }

    await logCron({
      job: "graph-ai",
      status: "success",
      updated,
      time: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      updated,
    });

  } catch (err) {
    await logCron({
      job: "graph-ai",
      status: "error",
      message: err.message,
    });

    return res.status(500).json({ success: false, error: err.message });
  }
         }
