import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";

import { conversionScore } from "../../lib/conversionScore";

/* ================= FIREBASE (SAFE SINGLETON) ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const db = getFirestore(app);

/* ================= FAST SAFE HELPERS ================= */
const safeText = (v, fallback = "") =>
  typeof v === "string" ? v : fallback;

const safeNumber = (v, fallback = 0) =>
  typeof v === "number" ? v : fallback;

/* ================= CACHE (IN-MEMORY) ================= */
let cache = null;
let lastFetch = 0;
const TTL = 1000 * 60 * 5; // 5 minutes

/* ================= ADSENSE DESCRIPTION ================= */
function buildAdSenseDescription(p) {
  return `Discover ${p.title} at $${p.price}. Category: ${p.category}. High value product with strong performance and user demand.`;
}

/* ================= REVIEWS (LIGHTWEIGHT) ================= */
function buildReviews(p) {
  return [
    {
      user: "Ahmed",
      rating: 5,
      comment: `${p.title} is very useful for daily use.`,
    },
    {
      user: "Sara",
      rating: 4,
      comment: `Good value and quality in ${p.category}.`,
    },
    {
      user: "Mike",
      rating: 4,
      comment: `Solid performance overall.`,
    },
  ];
}

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  try {
    const now = Date.now();

    /* ================= CACHE HIT (🔥 SPEED BOOST) ================= */
    if (cache && now - lastFetch < TTL) {
      return res.status(200).json(cache);
    }

    /* ================= FIRESTORE READ ================= */
    const snap = await getDocs(collection(db, "products"));

    const rawProducts = snap.docs;

    /* ================= TRANSFORM (FAST LOOP) ================= */
    const products = new Array(rawProducts.length);

    for (let i = 0; i < rawProducts.length; i++) {
      const d = rawProducts[i];
      const p = d.data();

      const product = {
        id: d.id,
        title: safeText(p.title),
        image: safeText(p.image),
        price: safeNumber(p.price),
        category: safeText(p.category, "general"),
        link: safeText(p.link, "#"),
        views: safeNumber(p.views),
        clicks: safeNumber(p.clicks),
        orders: safeNumber(p.orders),
        viralBoost: !!p.viralBoost,
      };

      const score = conversionScore(product);

      products[i] = {
        ...product,
        conversionScore: score,
        adSenseDescription: buildAdSenseDescription(product),
        reviews: buildReviews(product),
      };
    }

    /* ================= FAST SORT ================= */
    products.sort((a, b) => b.conversionScore - a.conversionScore);

    /* ================= SEGMENTS ================= */
    const topPicks = products.slice(0, 8);
    const bestBuy = products.slice(8, 16);
    const impulseDeals = [];

    for (let i = 0; i < products.length; i++) {
      if (products[i].conversionScore > 80) {
        impulseDeals.push(products[i]);
      }
    }

    /* ================= SEO STRUCTURED DATA ================= */
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Koloonline Product Ranking",
      itemListElement: topPicks.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: p.title,
        url: p.link,
      })),
    };

    /* ================= RESPONSE ================= */
    const response = {
      success: true,
      engine: "conversion-ai-v3-ultra-fast",
      topPicks,
      bestBuy,
      impulseDeals,
      structuredData,
      meta: {
        total: products.length,
        timestamp: now,
      },
    };

    /* ================= SAVE CACHE ================= */
    cache = response;
    lastFetch = now;

    return res.status(200).json(response);

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Unknown error",
    });
  }
}
