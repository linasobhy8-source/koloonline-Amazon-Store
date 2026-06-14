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

const baseUrl = "https://koloonline.online";

/* ================= HELPERS ================= */
function safe(v) {
  return typeof v === "string" ? v.trim() : "";
}

/* ================= VIRAL SCORE ================= */
function viralScore(data) {
  let score = 0;

  score += (data.views || 0) * 0.5;
  score += (data.clicks || 0) * 1.5;
  score += (data.likes || 0) * 2;
  score += (data.orders || 0) * 5;
  score += (data.rating || 0) * 10;

  if (data.viralBoost) score += 50;

  return score;
}

/* ================= PRIORITY ENGINE ================= */
function getPriority(score) {
  if (score > 80) return 1.0;
  if (score > 60) return 0.85;
  if (score > 40) return 0.7;
  if (score > 25) return 0.6;
  return 0.4;
}

/* ================= INDEXNOW CALL ================= */
async function sendIndexNow(urlList) {
  const KEY = process.env.INDEXNOW_KEY;

  if (!KEY) return null;

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
    return { ok: false, error: e.message };
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

      // ❌ remove weak products
      if (score < 25) return;

      const priority = getPriority(score);

      const url = `${baseUrl}/product/${doc.id}`;

      urls.push(url);

      // priority urls only
      if (priority >= 0.7) {
        priorityUrls.push(url);
      }
    });

    /* ================= DEDUP ================= */
    const unique = [...new Set(urls)];
    const uniquePriority = [...new Set(priorityUrls)];

    /* ================= CHUNKING ================= */
    const chunkSize = 50;
    const chunks = [];

    for (let i = 0; i < uniquePriority.length; i += chunkSize) {
      chunks.push(uniquePriority.slice(i, i + chunkSize));
    }

    /* ================= INDEXNOW ================= */
    const results = [];

    for (const chunk of chunks) {
      const r = await sendIndexNow(chunk);
      results.push(r);
    }

    /* ================= GOOGLE PING ================= */
    fetch(
      `https://www.google.com/ping?sitemap=${baseUrl}/sitemap.xml`
    ).catch(() => {});

    return res.status(200).json({
      success: true,
      totalUrls: unique.length,
      priorityUrls: uniquePriority.length,
      chunks: chunks.length,
      runtime: Date.now() - start,
      results,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
      }
