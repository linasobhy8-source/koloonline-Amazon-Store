import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export default async function handler(req, res) {
  const { action } = req.query;

  try {
    /* ================= SEO ================= */
    if (action === "seo") {
      return res.status(200).json({
        status: "ok",
        seo: {
          title: "Koloonline Amazon Store",
          description: "AI-powered Amazon deals engine",
          index: true,
        },
      });
    }

    /* ================= ANALYTICS ================= */
    if (action === "analytics") {
      const snap = await getDocs(collection(db, "analytics"));

      return res.status(200).json({
        total: snap.size,
      });
    }

    /* ================= DEFAULT ================= */
    return res.status(400).json({
      error: "Invalid system action",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
