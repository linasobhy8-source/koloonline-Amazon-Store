/* ================= AI SEO GRAPH ENGINE ================= */

/**
 * builds semantic internal linking graph
 * based on title + category similarity
 */

function normalize(text = "") {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

function similarity(a = "", b = "") {
  const A = normalize(a).split(" ");
  const B = normalize(b).split(" ");

  const common = A.filter(word => B.includes(word)).length;

  return common / Math.max(A.length, 1);
}

/* ================= MAIN GRAPH BUILDER ================= */

export function buildSeoGraph(items = [], limit = 5) {
  if (!items.length) return [];

  return items.map((item) => {
    const scored = items
      .filter((p) => p.asin !== item.asin)
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
  if (!posts.length) return [];

  return posts.map((post) => {
    const scored = posts
      .filter((p) => p.slug !== post.slug)
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

/* ================= MIXED GRAPH (BLOG + PRODUCT) ================= */

export function buildHybridGraph(products = [], posts = []) {
  const enrichedProducts = buildSeoGraph(products, 3);
  const enrichedPosts = buildBlogGraph(posts, 3);

  return {
    products: enrichedProducts,
    posts: enrichedPosts,
  };
                          }
