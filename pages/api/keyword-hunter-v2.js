import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
  serverTimestamp,
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= CONFIG ================= */
const BLOG_ENDPOINT =
  process.env.AUTO_BLOG_ENDPOINT ||
  "https://koloonline.online/api/auto-blog-generator-v2";

/* ================= LIMIT CONTROL (ANTI SPAM) ================= */
const DAILY_LIMIT = 20;

/* ================= SEEDS ================= */
const seedKeywords = [
  "best wireless earbuds 2026",
  "cheap smart watch for fitness",
  "fast charging power bank review",
  "best laptop accessories for students",
  "top fitness tracker amazon",
  "budget noise cancelling headphones",
  "gaming accessories cheap amazon",
  "best amazon deals today 2026",
  "best phone under 300 dollars",
  "wireless earbuds noise cancelling review",
  "best tech gifts under 50",
  "amazon hidden gems 2026",
  "viral tiktok amazon products",
];

/* ================= SCORE ENGINE ================= */
function calculateScore(keyword = "") {
  const k = keyword.toLowerCase();

  let score = 0;

  // intent signals
  if (k.includes("best")) score += 25;
  if (k.includes("cheap")) score += 18;
  if (k.includes("review")) score += 22;
  if (k.includes("deal")) score += 25;
  if (k.includes("buy")) score += 30;
  if (k.includes("under")) score += 20;

  // platform signals
  if (k.includes("amazon")) score += 10;

  // trend signals
  if (k.includes("2026")) score += 15;
  if (k.includes("viral")) score += 30;
  if (k.includes("tiktok")) score += 25;

  // category signals
  if (k.includes("headphones")) score += 20;
  if (k.includes("earbuds")) score += 22;
  if (k.includes("smart watch")) score += 20;
  if (k.includes("laptop")) score += 15;
  if (k.includes("gaming")) score += 18;
  if (k.includes("fitness")) score += 12;
  if (k.includes("gifts")) score += 15;
  if (k.includes("accessories")) score += 10;

  return score;
}

/* ================= NORMALIZE ================= */
function normalizeKeyword(k = "") {
  return k.toLowerCase().trim();
}

/* ================= VALIDATION ================= */
function isValidKeyword(keyword = "") {
  const k = normalizeKeyword(keyword);

  if (!k || k.length < 6) return false;

  // reject weak/generic keywords
  const banned = ["products", "amazon stuff", "buy things", "random"];
  if (banned.some((b) => k.includes(b))) return false;

  return true;
}

/* ================= DUPLICATE CHECK ================= */
async function keywordExists(keyword) {
  const snap = await getDocs(
    query(
      collection(db, "keywords"),
      where("keyword", "==", keyword),
      limit(1)
    )
  );

  return !snap.empty;
}

/* ================= DAILY LIMIT CHECK ================= */
async function getTodayCount() {
  const snap = await getDocs(collection(db, "keywords"));
  const today = new Date().toDateString();

  return snap.docs.filter((d) => {
    const data = d.data();
    if (!data.createdAt) return false;
    return new Date(data.createdAt.toDate()).toDateString() === today;
  }).length;
}

/* ================= LOG ================= */
async function writeLog(data) {
  try {
    await addDoc(collection(db, "cron_logs"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch {}
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const startTime = Date.now();

  try {
    const todayCount = await getTodayCount();

    if (todayCount >= DAILY_LIMIT) {
      return res.status(200).json({
        success: true,
        message: "Daily limit reached",
        processed: 0,
      });
    }

    const selected = [...seedKeywords]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    const results = [];

    for (const keyword of selected) {
      try {
        const normalized = normalizeKeyword(keyword);

        // 1. validation gate
        if (!isValidKeyword(normalized)) {
          results.push({
            keyword,
            status: "invalid",
          });
          continue;
        }

        // 2. scoring
        const score = calculateScore(normalized);

        if (score < 55) {
          results.push({
            keyword,
            status: "low_score",
            score,
          });
          continue;
        }

        // 3. duplicate check
        const exists = await keywordExists(normalized);

        if (exists) {
          results.push({
            keyword,
            status: "duplicate",
          });
          continue;
        }

        // 4. save keyword
        const ref = await addDoc(collection(db, "keywords"), {
          keyword: normalized,
          score,
          priority: score >= 75 ? "high" : "medium",
          status: "approved",
          source: "keyword_hunter_v4",
          createdAt: serverTimestamp(),
        });

        // 5. log
        writeLog({
          type: "keyword_added",
          keyword: normalized,
          score,
          docId: ref.id,
        });

        // 6. trigger blog generation (only high quality)
        if (score >= 70) {
          fetch(BLOG_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ keyword: normalized }),
          }).catch(() => {});
        }

        results.push({
          keyword: normalized,
          status: "approved",
          score,
          id: ref.id,
        });
      } catch (err) {
        writeLog({
          type: "keyword_error",
          keyword,
          error: err?.message || "Unknown error",
        });

        results.push({
          keyword,
          status: "error",
        });
      }
    }

    return res.status(200).json({
      success: true,
      runtime: Date.now() - startTime,
      processed: selected.length,
      approved: results.filter((r) => r.status === "approved").length,
      skipped: results.filter((r) => r.status !== "approved").length,
      results,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Internal Server Error",
    });
  }
      }
