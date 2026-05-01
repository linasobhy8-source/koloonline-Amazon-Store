import { db } from "../../config/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const { type, asin, userId = "guest_1" } = req.body;

    if (!type || !asin) {
      return res.status(400).json({
        success: false,
        error: "type and asin required"
      });
    }

    const ref = doc(db, "analytics_products", asin);
    const snap = await getDoc(ref);

    /* ================= INIT DOC ================= */
    if (!snap.exists()) {
      await setDoc(ref, {
        clicks: 0,
        views: 0,
        orders: 0,
        users: [],
        lastUpdated: new Date()
      });
    }

    /* ================= UPDATE RULES ================= */
    const updates = {
      lastUpdated: new Date()
    };

    if (type === "view") {
      updates.views = increment(1);
    }

    if (type === "click") {
      updates.clicks = increment(1);
    }

    if (type === "order") {
      updates.orders = increment(1);
    }

    /* ================= SAVE ================= */
    await updateDoc(ref, updates);

    return res.status(200).json({
      success: true,
      message: "event tracked",
      type,
      asin
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
