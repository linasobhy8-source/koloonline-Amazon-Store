import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { conversionScore } from "../../lib/conversionScore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => {
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
        score: p.score || 0,
        viralBoost: p.viralBoost || false,
      };
    });

    // 🧠 AI ranking
    products = products
      .map((p) => ({
        ...p,
        conversionScore: conversionScore(p),
      }))
      .sort((a, b) => b.conversionScore - a.conversionScore);

    const topPicks = products.slice(0, 8);
    const bestBuy = products.slice(8, 16);
    const impulseDeals = products.filter((p) => p.conversionScore > 80);

    return res.status(200).json({
      success: true,
      topPicks,
      bestBuy,
      impulseDeals,
      engine: "conversion-ai-v1",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
      }
