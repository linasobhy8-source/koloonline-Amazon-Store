
/* ================= SAFE HELPERS ================= */
function normalize(text = "") {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
}

/* ================= KEYWORD EXTRACTION ================= */
function extractKeywords(title = "") {
  return normalize(title)
    .split(" ")
    .filter((word) => word.length > 3);
}

/* ================= SEO SCORE CALCULATION ================= */
function calculateScore(currentItem, item) {
  let score = 0;

  const currentTitle = normalize(currentItem.title || "");
  const itemTitle = normalize(item.title || "");

  const currentCategory = currentItem.category || "";
  const itemCategory = item.category || "";

  const currentKeywords = extractKeywords(currentTitle);

  // 🔥 1. Same category boost (strong SEO signal)
  if (currentCategory && currentCategory === itemCategory) {
    score += 5;
  }

  // 🔥 2. Keyword overlap (strong relevance signal)
  currentKeywords.forEach((word) => {
    if (itemTitle.includes(word)) {
      score += 2;
    }
  });

  // 🔥 3. Title similarity boost
  const sharedWords = currentKeywords.filter((w) =>
    itemTitle.includes(w)
  ).length;

  score += sharedWords;

  // 🔥 4. Popularity boost (if exists)
  if (item.popularityScore) {
    score += item.popularityScore * 0.5;
  }

  // 🔥 5. Price presence boost (real product signal)
  if (item.price) {
    score += 0.5;
  }

  return score;
}

/* ================= MAIN ENGINE ================= */
export function generateInternalLinks({
  currentItem,
  allItems = [],
  limit = 8,
}) {
  if (!currentItem || !allItems.length) return [];

  const scored = allItems
    .filter((item) => {
      if (!item?.title) return false;
      if (item.asin === currentItem.asin) return false;
      return true;
    })
    .map((item) => {
      return {
        ...item,
        score: calculateScore(currentItem, item),
      };
    })
    .sort((a, b) => b.score - a.score);

  /* ================= DIVERSITY CONTROL ================= */
  const results = [];
  const usedCategories = new Set();

  for (const item of scored) {
    // avoid repeating same category too much
    if (usedCategories.has(item.category)) {
      continue;
    }

    results.push(item);
    usedCategories.add(item.category);

    if (results.length >= limit) break;
  }

  return results;
}
