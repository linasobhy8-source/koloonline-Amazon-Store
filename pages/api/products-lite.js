import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

let cache = null;
let lastFetch = 0;
const TTL = 1000 * 60 * 10;

export default async function handler(req, res) {
  try {
    const now = Date.now();

    if (cache && now - lastFetch < TTL) {
      return res.status(200).json(cache);
    }

    const snap = await getDocs(collection(db, "products"));

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    cache = data;
    lastFetch = now;

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=3600"
    );

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
