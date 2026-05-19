import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= SCORE ENGINE ================= */
function contentScore(p) {
  const views = p.views || 0;
  const clicks = p.clicks || 0;
  const ctr = views > 0 ? clicks / views : 0;

  const ageHours =
    (Date.now() - new Date(p.createdAt || Date.now()).getTime()) /
    (1000 * 60 * 60);

  let score =
    views * 0.5 +
    clicks * 2 +
    ctr * 100;

  // decay for old content
  if (ageHours > 48) score *= 0.7;
  if (ageHours > 168) score *= 0.5;

  return score;
}

/* ================= MAIN LOOP ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "blog"));

    const posts = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= 1. SCORE ALL POSTS ================= */
    const scored = posts.map(p => ({
      ...p,
      score: contentScore(p),
    }));

    /* ================= 2. IDENTIFY PROBLEMS ================= */

    const lowPerformers = scored
      .filter(p => p.score < 50)
      .sort((a, b) => a.score - b.score)
      .slice(0, 10);

    const topPerformers = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    /* ================= 3. AUTO OPTIMIZATION ================= */

    const improvements = [];

    for (const post of lowPerformers) {
      try {
        const improvedTitle =
          post.title.includes("2026")
            ? post.title
            : `${post.title} (Updated 2026 Guide)`;

        await updateDoc(doc(db, "blog", post.id), {
          title: improvedTitle,
          seoBoost: true,
          updatedAt: new Date().toISOString(),
        });

        improvements.push({
          id: post.id,
          action: "title_optimized",
        });

      } catch (e) {
        improvements.push({
          id: post.id,
          error: e.message,
        });
      }
    }

    /* ================= 4. DISCOVER RE-BOOST ================= */

    await fetch("https://koloonline.online/api/seo/v6-seo-brain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "blog" }),
    }).catch(() => {});

    /* ================= 5. OPTIONAL: CONTENT REFRESH SIGNAL ================= */

    await fetch("https://koloonline.online/api/master-pipeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "blog",
        id: "autonomous-loop",
      }),
    }).catch(() => {});

    /* ================= RESULT ================= */

    return res.status(200).json({
      success: true,
      analyzed: posts.length,
      optimized: improvements.length,
      lowPerformers: lowPerformers.map(p => ({
        id: p.id,
        score: p.score,
      })),
      topPerformers: topPerformers.map(p => ({
        id: p.id,
        score: p.score,
      })),
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
