import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../../config/firebase";

export default async function handler(req, res) {
  try {
    const q = query(collection(db, "products"), limit(50));
    const snap = await getDocs(q);

    const data = snap.docs.map(d => ({
      id: d.id,
      title: d.data().title,
      price: d.data().price,
      image: d.data().image
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
