/* ================= AI SEO CLUSTER SYSTEM ================= */

function normalize(text = "") {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

/* ================= KEYWORD MATCH ================= */
function getSimilarity(a = "", b = "") {
  const A = normalize(a).split(" ");
  const B = normalize(b).split(" ");

  const match = A.filter((w) => B.includes(w)).length;

  return match / Math.max(A.length, 1);
}

/* ================= CLUSTER BUILDER ================= */

export function buildSeoClusters(items = []) {
  if (!items.length) return [];

  const clusters = [];

  items.forEach((item) => {
    const category = item.category || "general";

    let cluster = clusters.find(
      (c) => c.category === category
    );

    if (!cluster) {
      cluster = {
        category,
        items: [],
      };
      clusters.push(cluster);
    }

    cluster.items.push(item);
  });

  /* ================= ENRICH EACH CLUSTER ================= */

  return clusters.map((cluster) => {
    const enriched = cluster.items.map((item) => {
      const related = cluster.items
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
      };
    });

    return {
      category: cluster.category,
      items: enriched,
      total: enriched.length,
    };
  });
}

/* ================= FIND CLUSTER ================= */

export function findCluster(clusters = [], category) {
  return clusters.find(
    (c) => c.category === category
  );
}
