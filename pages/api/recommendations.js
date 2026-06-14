import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { conversionScore } from "../../lib/conversionScore";

let cache = null;
let last = 0;
const TTL = 1000 * 60 * 5;

export default async function handler(req, res) {
  try {
    const now = Date.now();

    if (cache && now - last < TTL) {
      return res.status(200).json(cache);
    }

    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((d) => {
      const p = d.data();

      return {
        id: d.id,
        title: p.title || "",
        image: p.image || "",
        price: p.price || 0,
        category: p.category || "general",
        link: p.link || "#",
        views: p.views || 0,
        clicks: p.clicks || 0,
        orders: p.orders || 0,
        viralBoost: !!p.viralBoost,
      };
    });

    const ranked = products
      .map((p) => ({
        ...p,
        conversionScore: conversionScore(p),
      }))
      .sort((a, b) => b.conversionScore - a.conversionScore);

    const response = {
      success: true,
      topPicks: ranked.slice(0, 8),
      bestBuy: ranked.slice(8, 16),
    };

    cache = response;
    last = now;

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
