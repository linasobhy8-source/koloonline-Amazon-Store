const cache = new Map();

/* ================= GET CACHE ================= */
export function getCache(key) {
  if (!key) return null;

  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

/* ================= SET CACHE ================= */
export function setCache(key, data, ttl = 60 * 1000) {
  if (!key) return;

  cache.set(key, {
    data,
    expiry: Date.now() + Number(ttl || 60000),
  });
}

/* ================= OPTIONAL CLEAR ================= */
export function clearCache() {
  cache.clear();
}
