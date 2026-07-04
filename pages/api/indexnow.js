import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= CONFIG ================= */
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

const KEY = process.env.INDEXNOW_KEY;

/* ================= HELPERS ================= */
const safe = (v) => (typeof v === "string" ? v.trim() : "");

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.includes("koloonline");
  } catch {
    return false;
  }
}

/* ================= SCORE ENGINE ================= */
function viralScore(data = {}) {
  const views = Math.min(Number(data.views) || 0, 2000);
  const clicks = Math.min(Number(data.clicks) || 0, 1000);
  const likes = Math.min(Number(data.likes) || 0, 500);
  const orders = Math.min(Number(data.orders) || 0, 200);
  const rating = Math.min(Number(data.rating) || 0, 5);

  let score =
    views * 0.25 +
    clicks * 0.8 +
    likes * 1.5 +
    orders * 5 +
    rating * 10;

  if (data.viralBoost) score += 40;

  return Math.min(score, 150);
}

/* ================= PRIORITY ================= */
function getTier(score) {
  if (score >= 90) return "elite";
  if (score >= 60) return "high";
  if (score >= 35) return "normal";
  return "low";
}

/* ================= INDEXNOW REQUEST ================= */
async function sendIndexNow(urlList) {
  if (!KEY) return { ok: false, error: "Missing KEY" };
  if (!urlList.length) return { ok: false, error: "Empty batch" };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "koloonline.online",
        key: KEY,
        urlList,
      }),
    });

    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, error: e?.message || "failed" };
  }
}

/* ================= RETRY SYSTEM ================= */
async function sendWithRetry(urls, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    const res = await sendIndexNow(urls);

    if (res.ok) return res;

    await new Promise((r) => setTimeout(r, 1200 * (i + 1)));
  }

  return { ok: false, error: "max retries reached" };
}

/* ================= CHUNK ================= */
function chunk(arr, size = 50) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const start = Date.now();

  try {
    const snap = await getDocs(collection(db, "products"));

    const allUrls = new Set();
    const eliteUrls = new Set();

    snap.forEach((doc) => {
      const p = doc.data();

      const slug = safe(p.slug) || doc.id;
      const url = `${baseUrl}/product/${slug}`;

      if (!isValidUrl(url)) return;

      const score = viralScore(p);
      const tier = getTier(score);

      allUrls.add(url);

      if (tier === "elite" || tier === "high") {
        eliteUrls.add(url);
      }
    });

    const eliteArray = [...eliteUrls];
    const allArray = [...allUrls];

    const chunks = chunk(eliteArray, 50);

    const results = [];

    /* ================= PARALLEL SAFE EXECUTION ================= */
    for (const batch of chunks) {
      const result = await sendWithRetry(batch);
      results.push({
        size: batch.length,
        ...result,
      });

      // safe throttle (avoid spam)
      await new Promise((r) => setTimeout(r, 1000));
    }

    return res.status(200).json({
      success: true,
      totalProducts: snap.size,
      totalUrls: allArray.length,
      eliteIndexed: eliteArray.length,
      chunks: chunks.length,
      runtimeMs: Date.now() - start,
      results,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err?.message || "server error",
    });
  }
    }
