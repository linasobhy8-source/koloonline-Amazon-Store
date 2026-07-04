
/* ================= SAFE FALLBACK ================= */
const fallbackQueries = [
  { keyword: "amazon deals", impressions: 0, ctr: 0 },
];

/* ================= GET TOP QUERIES ================= */
export async function getTopQueries(realData = null) {
  try {
    // If real data exists (future GSC integration)
    if (Array.isArray(realData) && realData.length > 0) {
      return normalizeQueries(realData);
    }

    // fallback safe data
    return normalizeQueries(fallbackQueries);
  } catch (error) {
    console.log("[SEO] getTopQueries error:", error);
    return fallbackQueries;
  }
}

/* ================= NORMALIZE DATA ================= */
function normalizeQueries(data) {
  return data.map((item) => ({
    keyword: item.keyword || "unknown keyword",
    impressions: Number(item.impressions || 0),
    ctr: Number(item.ctr || 0),

    // SEO derived signals
    score: calculateScore(item),
    intent: detectIntent(item.keyword),
  }));
}

/* ================= SEO SCORE ENGINE ================= */
function calculateScore(item) {
  const impressions = Number(item.impressions || 0);
  const ctr = Number(item.ctr || 0);

  // weighted SEO score
  return impressions * 0.7 + ctr * 100;
}

/* ================= INTENT DETECTION ================= */
function detectIntent(keyword = "") {
  const k = keyword.toLowerCase();

  if (k.includes("best") || k.includes("top")) return "commercial";
  if (k.includes("cheap") || k.includes("deal")) return "price-driven";
  if (k.includes("review")) return "research";
  if (k.includes("buy")) return "transactional";

  return "informational";
}

/* ================= FUTURE EXTENSION HOOK ================= */
export function mapQueriesToProducts(queries = [], products = []) {
  if (!queries.length || !products.length) return [];

  return queries.map((q) => {
    const matchedProducts = products
      .filter((p) =>
        (p.title || "").toLowerCase().includes(q.keyword.toLowerCase())
      )
      .slice(0, 5);

    return {
      ...q,
      matchedProducts,
    };
  });
}
