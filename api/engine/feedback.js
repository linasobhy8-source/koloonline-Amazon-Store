import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProductBrain } from "../../ai/brain/self-learning";

export default async function handler(req, res) {
  const start = Date.now();

  /* ================= METHOD GUARD ================= */
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    const { id, event, product } = req.body || {};

    /* ================= VALIDATION ================= */
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid id",
      });
    }

    if (!event || typeof event !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid event",
      });
    }

    if (!product || typeof product !== "object") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid product",
      });
    }

    /* ================= AI ENGINE ================= */
    let newWeight = updateProductBrain(product, event);

    // حماية من NaN / undefined
    if (typeof newWeight !== "number" || isNaN(newWeight)) {
      newWeight = 0;
    }

    /* ================= DB UPDATE ================= */
    await updateDoc(doc(db, "products", id), {
      aiWeight: newWeight,
      lastUpdatedAt: Date.now(),
      lastEvent: event,
    });

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      newWeight,
      runtime: Date.now() - start,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Internal Error",
    });
  }
                      }
