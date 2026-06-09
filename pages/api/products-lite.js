import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../../config/firebase";

let cache = null;
let lastFetch = 0;

const TTL = 1000 * 60 * 10;

/* ================= SAFE ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  return "";
};

export default async function handler(req, res) {
  try {
    const now = Date.now();

    if (cache && now - lastFetch < TTL) {
      return res.status(200).json(cache);
    }

    const q = query(
      collection(db, "products"),
      limit(500)
    );

    const snap = await getDocs(q);

    const data = snap.docs.map((d) => {
      const item = d.data() || {};

      return {
        id: d.id,
        title: safeText(item.title),
        description: safeText(item.description),
        image: safeText(item.image),
        price: Number(item.price || 0),
        category: safeText(item.category),
        link: safeText(item.link),
        score: Number(item.score || 0),
      };
    });

    cache = data;
    lastFetch = now;

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=3600"
    );

    return res.status(200).json(data);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      success: false,
      error: e?.message || "Server Error",
    });
  }
}
