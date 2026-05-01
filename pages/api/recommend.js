import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const asin = req.query.asin;

    if (!asin) {
      return res.status(400).json({ error: "asin required" });
    }

    const ref = doc(db, "product_relations", asin);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return res.status(200).json({
        alsoViewed: [],
        boughtTogether: [],
      });
    }

    return res.status(200).json(snap.data());

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
