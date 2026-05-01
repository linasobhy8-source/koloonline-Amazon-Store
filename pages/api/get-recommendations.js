import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const asin = req.query.asin;

    if (!asin) {
      return res.status(400).json({
        success: false,
        error: "asin is required"
      });
    }

    const ref = doc(db, "product_relations", asin);
    const snap = await getDoc(ref);

    /* ================= NO DATA ================= */
    if (!snap.exists()) {
      return res.status(200).json({
        success: true,
        asin,
        alsoViewed: [],
        boughtTogether: [],
        recommended: [],
        message: "No relations found (AI will generate soon)"
      });
    }

    const data = snap.data();

    /* ================= SAFE RESPONSE ================= */
    return res.status(200).json({
      success: true,
      asin,
      alsoViewed: data.alsoViewed || [],
      boughtTogether: data.boughtTogether || [],
      recommended: data.recommended || []
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
