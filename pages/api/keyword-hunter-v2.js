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
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

const db = getFirestore(app);

/* ================= CONFIG ================= */
const BLOG_ENDPOINT =
  process.env.AUTO_BLOG_ENDPOINT ||
  "https://koloonline.online/api/auto-blog-generator-v2";

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

/* ================= SCORE ================= */
function calculateScore(keyword = "") {
  const k = keyword.toLowerCase();

  let score = 0;

  if (k.includes("best")) score += 25;
  if (k.includes("cheap")) score += 20;
  if (k.includes("review")) score += 18;
  if (k.includes("deal")) score += 25;
  if (k.includes("buy")) score += 30;
  if (k.includes("under")) score += 20;
  if (k.includes("amazon")) score += 10;

  if (k.includes("2026")) score += 15;
  if (k.includes("viral")) score += 30;
  if (k.includes("tiktok")) score += 25;

  if (k.includes("headphones")) score += 20;
  if (k.includes("earbuds")) score += 20;
  if (k.includes("smart watch")) score += 20;
  if (k.includes("laptop")) score += 15;
  if (k.includes("gaming")) score += 20;

  if (k.includes("gifts")) score += 15;
  if (k.includes("fitness")) score += 10;
  if (k.includes("accessories")) score += 10;

  return score;
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

/* ================= LOG ================= */
async function writeLog(data) {
  try {
    await addDoc(
      collection(db, "cron_logs"),
      {
        ...data,
        createdAt: serverTimestamp(),
      }
    );
  } catch {}
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const startTime = Date.now();

  try {
    const selected = [...seedKeywords]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    const results = [];

    for (const keyword of selected) {
      try {
        const score = calculateScore(keyword);

        if (score < 40) {
          results.push({
            keyword,
            status: "skipped",
            score,
          });

          continue;
        }

        const exists = await keywordExists(keyword);

        if (exists) {
          results.push({
            keyword,
            status: "duplicate",
            score,
          });

          continue;
        }

        const ref = await addDoc(
          collection(db, "keywords"),
          {
            keyword,
            score,
            priority:
              score >= 70 ? "high" : "medium",
            status: "approved",
            source: "keyword_hunter_v3",
            createdAt: serverTimestamp(),
          }
        );

        writeLog({
          type: "keyword_added",
          keyword,
          score,
          docId: ref.id,
        });

        fetch(BLOG_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            keyword,
          }),
        }).catch(() => {});

        results.push({
          keyword,
          score,
          status: "approved",
          id: ref.id,
        });
      } catch (err) {
        await writeLog({
          type: "keyword_error",
          keyword,
          error:
            err?.message ||
            "Unknown Error",
        });

        results.push({
          keyword,
          status: "error",
          error:
            err?.message ||
            "Unknown Error",
        });
      }
    }

    return res.status(200).json({
      success: true,
      runtime: Date.now() - startTime,
      processed: selected.length,
      approved: results.filter(
        (r) => r.status === "approved"
      ).length,
      skipped: results.filter(
        (r) => r.status === "skipped"
      ).length,
      duplicates: results.filter(
        (r) => r.status === "duplicate"
      ).length,
      results,
    });
  } catch (e) {
    console.error(
      "Keyword Hunter Error:",
      e
    );

    return res.status(500).json({
      success: false,
      error:
        e?.message ||
        "Internal Server Error",
    });
  }
      }
