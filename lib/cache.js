let cache = null;
let ts = 0;

const TTL = 1000 * 60 * 10;

export function isValid() {
  return cache && Date.now() - ts < TTL;
}

export function getCache() {
  return cache;
}

export function setCache(data) {
  cache = data;
  ts = Date.now();
}
