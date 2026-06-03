import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= EDGE CACHE READY API ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* 🔥 Cache at CDN level (VERY IMPORTANT) */
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=3600"
    );

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
