const HOME_CACHE_KEY = "homepage_cache";

let memoryCache = null;
let expireAt = 0;

/* ================= SET CACHE ================= */
export function setHomepageCache(data, ttl = 60 * 5) {
  try {
    memoryCache = data;
    expireAt = Date.now() + ttl * 1000;

    if (typeof window !== "undefined") {
      localStorage.setItem(
        HOME_CACHE_KEY,
        JSON.stringify({
          data,
          expireAt,
        })
      );
    }

    console.log("Homepage cache saved:", Array.isArray(data) ? data.length : 0);
  } catch (e) {
    console.error("Cache set error:", e);
  }
}

/* ================= GET CACHE ================= */
export function getHomepageCache() {
  try {
    if (memoryCache && Date.now() < expireAt) {
      return memoryCache;
    }

    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(HOME_CACHE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    if (Date.now() > parsed.expireAt) {
      localStorage.removeItem(HOME_CACHE_KEY);
      return null;
    }

    memoryCache = parsed.data;
    expireAt = parsed.expireAt;

    return parsed.data;
  } catch (e) {
    console.error("Cache read error:", e);
    return null;
  }
}

/* ================= UPDATE CACHE ================= */
/**
 * دي بدل النسخة القديمة (updateHomepageCache)
 * بقت فعليًا cache system مش مجرد log
 */
export async function updateHomepageCache(data) {
  if (!Array.isArray(data)) {
    console.warn("Invalid homepage cache data");
    return;
  }

  setHomepageCache(data);

  console.log("Homepage cache updated:", data.length);
}

/* ================= CLEAR CACHE ================= */
export function clearHomepageCache() {
  memoryCache = null;
  expireAt = 0;

  if (typeof window !== "undefined") {
    localStorage.removeItem(HOME_CACHE_KEY);
  }

  console.log("Homepage cache cleared");
}

/* ================= AUTO REFRESH GUARD ================= */
export function isCacheValid() {
  return memoryCache && Date.now() < expireAt;
}
