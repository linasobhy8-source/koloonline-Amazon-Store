import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

/* ================= AUTO AI BUILDER ================= */
export default async function handler(req, res) {
  try {
    const usersSnap = await getDocs(collection(db, "user_behavior"));

    const relationsMap = {};

    usersSnap.forEach((docSnap) => {
      const data = docSnap.data();

      const views = data.views || [];
      const clicks = data.clicks || [];
      const purchases = data.purchases || [];

      /* ================= 1. ALSO VIEWED ================= */
      for (let i = 0; i < views.length; i++) {
        const a = views[i];

        for (let j = i + 1; j < views.length; j++) {
          const b = views[j];

          if (a === b) continue;

          relationsMap[a] = relationsMap[a] || { alsoViewed: [], boughtTogether: [] };
          relationsMap[b] = relationsMap[b] || { alsoViewed: [], boughtTogether: [] };

          relationsMap[a].alsoViewed.push(b);
          relationsMap[b].alsoViewed.push(a);
        }
      }

      /* ================= 2. BOUGHT TOGETHER ================= */
      for (let i = 0; i < purchases.length; i++) {
        for (let j = i + 1; j < purchases.length; j++) {
          const a = purchases[i];
          const b = purchases[j];

          if (a === b) continue;

          relationsMap[a] = relationsMap[a] || { alsoViewed: [], boughtTogether: [] };
          relationsMap[b] = relationsMap[b] || { alsoViewed: [], boughtTogether: [] };

          relationsMap[a].boughtTogether.push(b);
          relationsMap[b].boughtTogether.push(a);
        }
      }
    });

    /* ================= SAVE TO FIRESTORE ================= */
    for (const asin in relationsMap) {
      const ref = doc(db, "product_relations", asin);

      await setDoc(
        ref,
        {
          alsoViewed: relationsMap[asin].alsoViewed,
          boughtTogether: relationsMap[asin].boughtTogether,
        },
        { merge: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "AI Relations Built Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
