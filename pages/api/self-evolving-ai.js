import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

/* ================= FIREBASE INIT ================= */
const app = !getApps().length
  ? initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  : getApps()[0];

const db = getFirestore(app);

/* ================= SAFE SCORE ENGINE ================= */
function calculateEvolutionScore(post) {
  if (!post) return 0;

  let score = 0;

  const views = post.views || 0;
  const clicks = post.clicks || 0;

  // content quality signals
  if (post.auto) score += 20;

  // engagement signals
  if (views > 100) score += 30;
  if (clicks > 20) score += 20;

  return score;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "blog"));

    const posts = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const evolution = posts.map((post) => {
      const score = calculateEvolutionScore(post);

      return {
        id: post.id,
        evolveScore: score,
        shouldRewrite: score < 40,
      };
    });

    return res.status(200).json({
      success: true,
      evolution,
      description:
        "This endpoint evaluates blog content performance using simple engagement signals such as views and clicks to identify posts that may need improvement.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
