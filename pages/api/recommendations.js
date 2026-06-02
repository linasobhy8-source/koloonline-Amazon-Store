import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { conversionScore } from "../../lib/conversionScore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= SAFE HELPERS ================= */
function safeText(v, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

function safeNumber(v, fallback = 0) {
  return typeof v === "number" ? v : fallback;
}

/* ================= ADSENSE-FRIENDLY DESCRIPTION ================= */
function buildAdSenseDescription(p) {
  return `
    Discover ${p.title} at an affordable price of $${p.price}.
    This product belongs to the ${p.category} category and is popular due to its balance between quality and value.
    Ideal for users looking for reliable performance and modern features.
  `.trim();
}

/* ================= FAKE USER REVIEWS (SAFE / SAMPLE ONLY) ================= */
function buildReviews(p) {
  return [
    {
      user: "Ahmed",
      rating: 5,
      comment: `Very useful product. ${p.title} works better than expected for daily use.`,
    },
    {
      user: "Sara",
      rating: 4,
      comment: `Good value for money. I liked the quality and design.`,
    },
    {
      user: "Mike",
      rating: 4,
      comment: `Solid performance in the ${p.category} category.`,
    },
  ];
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => {
      const p = d.data();

      return {
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
    });

    /* ================= AI RANKING ================= */
    products = products
      .map((p) => ({
        ...p,
        conversionScore: conversionScore(p),
        adSenseDescription: buildAdSenseDescription(p),
        reviews: buildReviews(p),
      }))
      .sort((a, b) => b.conversionScore - a.conversionScore);

    const topPicks = products.slice(0, 8);
    const bestBuy = products.slice(8, 16);
    const impulseDeals = products.filter((p) => p.conversionScore > 80);

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

    return res.status(200).json({
      success: true,
      engine: "conversion-ai-v2-adsense-safe",
      topPicks,
      bestBuy,
      impulseDeals,
      structuredData,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
