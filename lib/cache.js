let cache = null;
let lastFetch = 0;

export function getCache() {
  return cache;
}

export function setCache(data) {
  cache = data;
  lastFetch = Date.now();
}

export function isCacheValid() {
  return cache && Date.now() - lastFetch < 60000; // 1 min
}
