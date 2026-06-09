const cache = new Map();

/* ================= TTL CACHE ================= */
function setCache(key, data, ttl = 60 * 5) {
  cache.set(key, {
    data,
    expire: Date.now() + ttl * 1000,
  });
}

function getCache(key) {
  const item = cache.get(key);

  if (!item) return null;

  if (Date.now() > item.expire) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

/* ================= SMART FETCH WRAPPER ================= */
export async function aiFetch(key, fetcher, ttl = 300) {
  const cached = getCache(key);

  if (cached) return cached;

  const data = await fetcher();

  setCache(key, data, ttl);

  return data;
}

/* ================= FEED OPTIMIZER ================= */
export function optimizeFeed(products = []) {
  if (!Array.isArray(products)) return [];

  return products
    .slice(0, 30) // limit early for speed
    .map((p) => ({
      ...p,
      _score:
        (p.views || 0) +
        (p.clicks || 0) * 2 +
        (p.orders || 0) * 5 +
        (p.viralBoost ? 50 : 0),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 12);
}

/* ================= REQUEST DEDUP ================= */
const pending = new Map();

export async function dedup(key, fn) {
  if (pending.has(key)) {
    return pending.get(key);
  }

  const promise = Promise.resolve()
    .then(() => fn())
    .finally(() => {
      pending.delete(key);
    });

  pending.set(key, promise);

  return promise;
}

/* ================= ULTRA SAFE BATCH CACHE ================= */

/**
 * يمنع إعادة تحميل نفس الداتا في نفس اللحظة (critical for Firebase)
 */
export function batchOnce(key, fn) {
  return dedup(`batch:${key}`, fn);
}

/* ================= MEMORY GUARD (NEW) ================= */

/**
 * يمنع تسريب الذاكرة في Maps الكبيرة
 */
export function clearCache() {
  cache.clear();
}

/**
 * تنظيف تلقائي كل 10 دقائق
 */
if (typeof window !== "undefined") {
  setInterval(() => {
    cache.clear();
  }, 10 * 60 * 1000);
}
