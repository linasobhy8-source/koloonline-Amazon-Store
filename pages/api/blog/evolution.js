import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

/* ================= FIREBASE ================= */

const app = !getApps().length
  ? initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  : getApps()[0];

const db = getFirestore(app);

/* ================= SAFE ================= */

const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/* ================= AI SCORE ENGINE 2.0 ================= */

function evolveScore(post = {}) {
  const views = n(post.views);
  const clicks = n(post.clicks);
  const likes = n(post.likes);
  const comments = n(post.comments);
  const shares = n(post.shares);

  const ctr = views ? clicks / views : 0;
  const engagement = views ? (likes + comments + shares) / views : 0;

  const freshness =
    post.updatedAt
      ? 1 / (Math.log((Date.now() - new Date(post.updatedAt)) / 3600000 + 3))
      : 0.6;

  let score =
    views * 0.15 +
    clicks * 0.4 +
    likes * 0.6 +
    comments * 0.8 +
    shares * 1.2 +
    ctr * 80 +
    engagement * 120 +
    (post.auto ? 30 : 0);

  return score * freshness;
}

/* ================= CONTENT GAP DETECTOR ================= */

function contentGap(post = {}) {
  const text = (post.content || "").length;

  if (text < 500) return "low-content";
  if (text < 1200) return "medium-content";
  return "strong-content";
}

/* ================= DECISION ENGINE ================= */

function decision(score, post) {
  const gap = contentGap(post);

  if (score >= 250 && gap === "strong-content") return "keep";
  if (score >= 150) return "boost";
  if (score >= 80) return "rewrite-lite";
  return "rewrite-full";
}

/* ================= VIRAL SIGNAL ================= */

function isViral(post = {}) {
  return (
    n(post.shares) > 50 ||
    n(post.clicks) > 200 ||
    (post.views > 1000 && n(post.engagementRate) > 0.1)
  );
}

/* ================= HANDLER ================= */

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "blog"));

    const posts = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const evolution = posts.map((p) => {
      const score = evolveScore(p);
      const decision = decision(score, p);

      return {
        id: p.id,

        // AI Signals
        evolveScore: Math.round(score),
        decision,

        // Diagnostics
        contentType: contentGap(p),
        viral: isViral(p),

        // SEO signals
        seoBoost: score > 180,
        rewritePriority: decision.includes("rewrite"),
      };
    });

    return res.status(200).json({
      success: true,
      engine: "evolution-v2",
      total: evolution.length,
      data: evolution,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
                                 }
