import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const usersSnap = await getDocs(collection(db, "user_behavior"));

    const graph = {};

    usersSnap.forEach((u) => {
      const d = u.data();

      const views = d.views || [];
      const purchases = d.purchases || [];

      /* ================= ALSO VIEWED ================= */
      for (let i = 0; i < views.length; i++) {
        for (let j = i + 1; j < views.length; j++) {
          const a = views[i];
          const b = views[j];

          if (a === b) continue;

          graph[a] = graph[a] || { alsoViewed: [], boughtTogether: [] };
          graph[b] = graph[b] || { alsoViewed: [], boughtTogether: [] };

          graph[a].alsoViewed.push(b);
          graph[b].alsoViewed.push(a);
        }
      }

      /* ================= BOUGHT TOGETHER ================= */
      for (let i = 0; i < purchases.length; i++) {
        for (let j = i + 1; j < purchases.length; j++) {
          const a = purchases[i];
          const b = purchases[j];

          if (a === b) continue;

          graph[a] = graph[a] || { alsoViewed: [], boughtTogether: [] };
          graph[b] = graph[b] || { alsoViewed: [], boughtTogether: [] };

          graph[a].boughtTogether.push(b);
          graph[b].boughtTogether.push(a);
        }
      }
    });

    /* ================= SAVE AI GRAPH ================= */
    for (const asin in graph) {
      await setDoc(
        doc(db, "product_relations", asin),
        {
          alsoViewed: graph[asin].alsoViewed,
          boughtTogether: graph[asin].boughtTogether,
        },
        { merge: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Amazon AI Engine Built",
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
