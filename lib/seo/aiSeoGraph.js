/* ================= AI SEO GRAPH ENGINE ================= */

/**
 * Semantic internal linking system (optimized)
 */

function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function tokenize(text = "") {
  return normalize(text).split(" ").filter(Boolean);
}

function similarity(a = "", b = "") {
  const A = tokenize(a);
  const B = new Set(tokenize(b));

  if (!A.length || !B.size) return 0;

  let common = 0;

  for (const word of A) {
    if (B.has(word)) common++;
  }

  return common / Math.max(A.length, 1);
}

/* ================= PRODUCTS GRAPH ================= */

export function buildSeoGraph(items = [], limit = 5) {
  if (!Array.isArray(items) || !items.length) return [];

  return items.map((item) => {
    const scored = items
      .filter((p) => p.asin && item.asin && p.asin !== item.asin)
      .map((p) => ({
        ...p,
        score:
          similarity(item.title, p.title) * 2 +
          (item.category === p.category ? 1 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return {
      ...item,
      internalLinks: scored,
    };
  });
}

/* ================= BLOG GRAPH ================= */

export function buildBlogGraph(posts = [], limit = 5) {
  if (!Array.isArray(posts) || !posts.length) return [];

  return posts.map((post) => {
    const scored = posts
      .filter((p) => p.slug && p.slug !== post.slug)
      .map((p) => ({
        ...p,
        score: similarity(post.title, p.title),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return {
      ...post,
      internalLinks: scored,
    };
  });
}

/* ================= HYBRID GRAPH ================= */

export function buildHybridGraph(products = [], posts = []) {
  return {
    products: buildSeoGraph(products, 3),
    posts: buildBlogGraph(posts, 3),
  };
}
