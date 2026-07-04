const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

/* ================= SAFE FETCH ================= */
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      timeout: 10000,
    });

    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/* ================= GOOGLE PING ================= */
export async function pingGoogleSitemap() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;

  return safeFetch(
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
  );
}

/* ================= BING PING ================= */
export async function pingBingSitemap() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;

  return safeFetch(
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
  );
}

/* ================= INDEXNOW ================= */
export async function submitIndexNow(urls = []) {
  const key = process.env.INDEXNOW_KEY;

  if (!key) return { skipped: true };

  if (!urls.length) return { skipped: true };

  const payload = {
    host: "koloonline.online",
    key,
    urlList: urls.slice(0, 50),
  };

  return safeFetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

/* ================= MAIN ENGINE ================= */
export async function instantIndex({ urls = [] }) {
  const results = {};

  try {
    results.indexNow = await submitIndexNow(urls);
  } catch (e) {
    results.indexNow = { ok: false, error: e.message };
  }

  try {
    results.google = await pingGoogleSitemap();
  } catch (e) {
    results.google = { ok: false, error: e.message };
  }

  try {
    results.bing = await pingBingSitemap();
  } catch (e) {
    results.bing = { ok: false, error: e.message };
  }

  return {
    success: true,
    results,
    timestamp: new Date().toISOString(),
  };
}
