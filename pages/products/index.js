import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=86400"
    );

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
