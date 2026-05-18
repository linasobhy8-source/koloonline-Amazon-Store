import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= VIRAL SIGNALS ================= */
function predictVirality(post) {
  const title = (post.title || "").toLowerCase();
  const views = post.views || 0;
  const clicks = post.clicks || 0;

  const ctr = views > 0 ? clicks / views : 0;

  let score = 0;

  /* ================= TITLE SIGNALS ================= */
  const viralKeywords = [
    "best",
    "top",
    "vs",
    "cheap",
    "review",
    "amazon",
    "2026",
    "trending",
    "viral",
    "budget",
  ];

  viralKeywords.forEach(k => {
    if (title.includes(k)) score += 15;
  });

  /* ================= ENGAGEMENT SIGNALS ================= */
  score += views * 0.01;
  score += clicks * 0.05;
  score += ctr * 120;

  /* ================= FRESHNESS ================= */
  const ageHours =
    (Date.now() - new Date(post.createdAt || Date.now()).getTime()) /
    (1000 * 60 * 60);

  if (ageHours < 24) score += 20;
  if (ageHours < 6) score += 40;

  /* ================= PENALTY ================= */
  if (!post.image) score -= 10;
  if (!post.title) score -= 50;

  return score;
}

/* ================= MAIN ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "blog"));

    const posts = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= 1. PREDICT ALL ================= */
    const analyzed = posts.map(p => ({
      ...p,
      viralScore: predictVirality(p),
    }));

    /* ================= 2. CLASSIFY ================= */

    const highPotential = analyzed
      .filter(p => p.viralScore >= 80)
      .sort((a, b) => b.viralScore - a.viralScore);

    const mediumPotential = analyzed
      .filter(p => p.viralScore >= 40 && p.viralScore < 80);

    const weak = analyzed
      .filter(p => p.viralScore < 40);

    /* ================= 3. BOOST HIGH POTENTIAL ================= */

    const boosted = [];

    for (const post of highPotential.slice(0, 10)) {
      try {
        await updateDoc(doc(db, "blog", post.id), {
          seoBoost: true,
          discoverBoost: true,
          priority: "HIGH",
          updatedAt: new Date().toISOString(),
        });

        boosted.push({
          id: post.id,
          score: post.viralScore,
        });

      } catch (e) {
        boosted.push({
          id: post.id,
          error: e.message,
        });
      }
    }

    /* ================= 4. TRIGGER SEO BRAIN ================= */

    await fetch("https://koloonline.online/api/seo/v6-seo-brain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "blog" }),
    }).catch(() => {});

    /* ================= 5. TRIGGER AUTONOMOUS LOOP ================= */

    await fetch("https://koloonline.online/api/seo/autonomous-loop", {
      method: "POST",
    }).catch(() => {});

    /* ================= RESULT ================= */

    return res.status(200).json({
      success: true,
      total: posts.length,

      highPotential: highPotential.slice(0, 10).map(p => ({
        id: p.id,
        viralScore: p.viralScore,
      })),

      mediumPotential: mediumPotential.slice(0, 10).map(p => ({
        id: p.id,
        viralScore: p.viralScore,
      })),

      weak: weak.slice(0, 10).map(p => ({
        id: p.id,
        viralScore: p.viralScore,
      })),

      boosted: boosted,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
