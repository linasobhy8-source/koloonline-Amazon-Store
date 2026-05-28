import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../config/firebase";

export default async function handler(req, res) {
  try {
    const { type } = req.query;

    if (type === "trending") {
      const snap = await getDocs(
        query(collection(db, "products"), limit(20))
      );

      const products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      return res.json({ success: true, data: products });
    }

    return res.json({ success: true, message: "Data API working" });

  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
