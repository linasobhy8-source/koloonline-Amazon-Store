
/* ================= TEXT NORMALIZATION ================= */
function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ================= IMPROVED SIMILARITY (SEO BASED) ================= */
function getSimilarity(a = "", b = "") {
  const A = new Set(normalize(a).split(" "));
  const B = new Set(normalize(b).split(" "));

  let match = 0;

  A.forEach((word) => {
    if (B.has(word)) match++;
  });

  return match / Math.max(A.size, 1);
}

/* ================= DETECT INTENT CATEGORY ================= */
function detectIntent(item = {}) {
  const text = normalize(item.title + " " + (item.description || ""));

  if (text.includes("wireless") || text.includes("bluetooth"))
    return "electronics";

  if (text.includes("shoe") || text.includes("clothing"))
    return "fashion";

  if (text.includes("kitchen") || text.includes("cook"))
    return "home";

  return item.category || "general";
}

/* ================= CLUSTER BUILDER (SEO CORE) ================= */
export function buildSeoClusters(items = []) {
  if (!items.length) return [];

  const clusters = {};

  /* ================= GROUP BY INTENT ================= */
  items.forEach((item) => {
    const intent = detectIntent(item);

    if (!clusters[intent]) {
      clusters[intent] = [];
    }

    clusters[intent].push(item);
  });

  /* ================= ENRICH CLUSTERS ================= */
  return Object.keys(clusters).map((key) => {
    const items = clusters[key];

    const enriched = items.map((item) => {
      const related = items
        .filter((p) => p.asin !== item.asin)
        .map((p) => ({
          ...p,
          score: getSimilarity(item.title, p.title),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      return {
        ...item,
        related,
        seoScore: related.length,
      };
    });

    return {
      category: key,
      items: enriched,
      total: enriched.length,
      authority: calculateAuthority(enriched),
    };
  });
}

/* ================= SEO AUTHORITY SCORE ================= */
function calculateAuthority(items = []) {
  if (!items.length) return 0;

  const avg = items.reduce((sum, item) => {
    return sum + (item.related?.length || 0);
  }, 0);

  return avg / items.length;
}

/* ================= FIND CLUSTER ================= */
export function findCluster(clusters = [], category) {
  return clusters.find((c) => c.category === category);
}
