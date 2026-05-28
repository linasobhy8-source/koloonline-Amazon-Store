const cache = new Map();

export function getCache(key) {
  const item = cache.get(key);

  if (!item) return null;

  const isExpired = Date.now() > item.expiry;

  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

export function setCache(key, data, ttl = 60 * 1000) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl,
  });
}
