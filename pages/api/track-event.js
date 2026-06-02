import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/* ================= EVENT TRACKING API ================= */
export default async function handler(req, res) {
  /* ================= METHOD GUARD ================= */
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { type, asin } = req.body || {};

    /* ================= VALIDATION ================= */
    if (!type || !asin) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    /* ================= SAVE EVENT ================= */
    await addDoc(collection(db, "events"), {
      type,
      asin,
      createdAt: serverTimestamp(),
      timestamp: Date.now(),
    });

    return res.status(200).json({
      success: true,
      message: "Event recorded successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
