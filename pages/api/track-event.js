import { db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, asin } = req.body;

    await addDoc(collection(db, "events"), {
      type,
      asin,
      timestamp: Date.now(),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
