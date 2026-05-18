import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../config/firebase";
import { calculateTrendScore } from "../lib/trendScore";

/* ================= GROWTH ENGINE CORE ================= */
export async function runGrowthEngine() {
  try {
    const productsSnap = await getDocs(
      query(collection(db, "products"), limit(200))
    );

    const products = productsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= 1. TREND SCORING ================= */
    const scored = products.map((p) => ({
      ...p,
      trendScore: calculateTrendScore(p),
    }));

    const trending = scored.sort((a, b) => b.trendScore - a.trendScore);

    /* ================= 2. TOP CLUSTERS (SEO GROUPING) ================= */
    const clusters = createClusters(trending);

    /* ================= 3. FEATURED SELECTION ================= */
    const featured = trending.slice(0, 10);

    /* ================= 4. HIGH CONVERSION PICKS ================= */
    const highConversion = trending
      .filter((p) => (p.conversionScore || 0) > 70)
      .slice(0, 10);

    return {
      trending: trending.slice(0, 20),
      featured,
      clusters,
      highConversion,
      timestamp: Date.now(),
    };
  } catch (e) {
    return {
      trending: [],
      featured: [],
      clusters: [],
      highConversion: [],
      error: e.message,
    };
  }
}

/* ================= CLUSTER ENGINE (IMPORTANT SEO LAYER) ================= */
function createClusters(products) {
  const map = {};

  products.forEach((p) => {
    const category = (p.category || "general").toLowerCase();

    if (!map[category]) {
      map[category] = {
        category,
        items: [],
        avgScore: 0,
      };
    }

    map[category].items.push(p);
  });

  /* compute cluster scores */
  Object.keys(map).forEach((key) => {
    const items = map[key].items;

    map[key].avgScore =
      items.reduce((sum, i) => sum + (i.trendScore || 0), 0) /
      (items.length || 1);

    map[key].items = items
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 8);
  });

  return Object.values(map).sort((a, b) => b.avgScore - a.avgScore);
}
