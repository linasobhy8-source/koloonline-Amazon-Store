import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= BASE ================= */
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

/* ================= SAFE ================= */
const safe = (v) =>
  typeof v === "string" ? v.trim() : "";

/* ================= VALIDATION ================= */
function isValidUrl(url) {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
}

/* ================= VIRAL SCORE ================= */
function viralScore(data = {}) {
  const views = Math.min(data.views || 0, 1000);
  const clicks = Math.min(data.clicks || 0, 500);
  const likes = Math.min(data.likes || 0, 200);
  const orders = Math.min(data.orders || 0, 100);
  const rating = Math.min(data.rating || 0, 5);

  let score =
    views * 0.3 +
    clicks * 1 +
    likes * 2 +
    orders * 5 +
    rating * 10;

  if (data.viralBoost) score += 30;

  return Math.min(score, 120);
}

/* ================= PRIORITY ================= */
function getPriority(score) {
  if (score >= 90) return 1.0;
  if (score >= 70) return 0.85;
  if (score >= 50) return 0.7;
  if (score >= 30) return 0.6;
  return 0.4;
}

/* ================= INDEXNOW ================= */
async function sendIndexNow(urlList = []) {
  const KEY = process.env.INDEXNOW_KEY;

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

    return {
      ok: res.ok,
      status: res.status,
    };
  } catch (e) {
    return {
      ok: false,
      error: e?.message || "IndexNow failed",
    };
  }
}

/* ================= CHUNK ================= */
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const start = Date.now();

  try {
    const snap = await getDocs(collection(db, "products"));

    const urls = [];
    const priorityUrls = new Set(); // 🔥 prevent duplicates

    snap.forEach((doc) => {
      const data = doc.data();

      const score = viralScore(data);

      // 🔥 HARD FILTER
      if (score < 35) return;

      const slug = safe(data.slug) || doc.id;

      const url = `${baseUrl}/product/${slug}`;

      if (!isValidUrl(url)) return;

      urls.push(url);

      if (score >= 60) {
        priorityUrls.add(url);
      }
    });

    /* ================= CLEAN UNIQUE ================= */
    const uniqueUrls = [...new Set(urls)];
    const highPriority = [...priorityUrls];

    /* ================= SMART BATCHING ================= */
    const chunks = chunkArray(highPriority, 15);

    const results = [];

    /* ================= THROTTLED PUSH ================= */
    for (const chunk of chunks) {
      const result = await sendIndexNow(chunk);
      results.push({
        chunkSize: chunk.length,
        ...result,
      });

      // smart delay (Google safe)
      await new Promise((r) => setTimeout(r, 1500));
    }

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      totalProducts: snap.size,
      indexedTotal: uniqueUrls.length,
      priorityIndexed: highPriority.length,
      chunks: chunks.length,
      runtime: `${Date.now() - start}ms`,
      results,
    });

  } catch (err) {
    console.error("[INDEXNOW ERROR]", err);

    return res.status(500).json({
      success: false,
      error: err?.message || "Server error",
    });
  }
}
