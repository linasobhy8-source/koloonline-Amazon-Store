
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

/* ================= BASE URL ================= */
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

/* ================= SAFE HELPERS ================= */
const safe = (v) =>
  typeof v === "string" ? v.trim() : "";

/* ================= SAFE URL VALIDATION ================= */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/* ================= VIRAL SCORE (CAPPED) ================= */
function viralScore(data) {
  let score = 0;

  score += Math.min(data.views || 0, 1000) * 0.3;
  score += Math.min(data.clicks || 0, 500) * 1;
  score += Math.min(data.likes || 0, 200) * 2;
  score += Math.min(data.orders || 0, 100) * 5;
  score += Math.min(data.rating || 0, 5) * 10;

  if (data.viralBoost) score += 30;

  return Math.min(score, 120); // cap to avoid spam
}

/* ================= PRIORITY ENGINE ================= */
function getPriority(score) {
  if (score > 90) return 1.0;
  if (score > 70) return 0.85;
  if (score > 50) return 0.7;
  if (score > 30) return 0.6;
  return 0.4;
}

/* ================= INDEXNOW PUSH ================= */
async function sendIndexNow(urlList = []) {
  const KEY = process.env.INDEXNOW_KEY;

  if (!KEY) {
    return { ok: false, error: "Missing INDEXNOW_KEY" };
  }

  if (!urlList.length) {
    return { ok: false, error: "Empty urlList" };
  }

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: "koloonline.online",
        key: KEY,
        urlList,
      }),
    });

    return {
      ok: response.ok,
      status: response.status,
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
    };
  }
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const start = Date.now();

  try {
    const snap = await getDocs(collection(db, "products"));

    const urls = [];
    const priorityUrls = [];

    snap.forEach((doc) => {
      const data = doc.data();

      const score = viralScore(data);

      if (score < 30) return;

      const slug = safe(data.slug) || doc.id;

      const url = `${baseUrl}/product/${slug}`;

      if (!isValidUrl(url)) return;

      urls.push(url);

      if (score >= 60) {
        priorityUrls.push(url);
      }
    });

    /* ================= DEDUP ================= */
    const uniqueUrls = [...new Set(urls)];
    const uniquePriority = [...new Set(priorityUrls)];

    /* ================= BATCHING ================= */
    const chunkSize = 20;

    const chunks = [];

    for (let i = 0; i < uniquePriority.length; i += chunkSize) {
      chunks.push(uniquePriority.slice(i, i + chunkSize));
    }

    /* ================= PUSH WITH DELAY ================= */
    const results = [];

    for (const chunk of chunks) {
      const result = await sendIndexNow(chunk);
      results.push(result);

      // throttle to avoid rate limit
      await new Promise((r) => setTimeout(r, 1200));
    }

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      totalProducts: snap.size,
      indexed: uniqueUrls.length,
      priority: uniquePriority.length,
      chunks: chunks.length,
      runtime: `${Date.now() - start}ms`,
      results,
    });
  } catch (err) {
    console.error("[INDEX PUSH ERROR]", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
    }
