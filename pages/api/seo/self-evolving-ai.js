import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= CORE SCORING ================= */
function performanceScore(p) {
  const views = p.views || 0;
  const clicks = p.clicks || 0;

  const ctr = views > 0 ? clicks / views : 0;

  let score =
    views * 0.4 +
    clicks * 1.5 +
    ctr * 200;

  const ageHours =
    (Date.now() - new Date(p.createdAt || Date.now()).getTime()) /
    (1000 * 60 * 60);

  // decay
  if (ageHours > 24) score *= 0.9;
  if (ageHours > 72) score *= 0.7;
  if (ageHours > 168) score *= 0.5;

  return score;
}

/* ================= CONTENT EVOLUTION ================= */
function evolveContent(post) {
  const title = post.title || "";

  let newTitle = title;

  /* 🔥 Rule 1: revive weak content */
  if (post.views < 100 && !title.includes("Guide")) {
    newTitle = `${title} (Ultimate Guide 2026)`;
  }

  /* 🔥 Rule 2: boost CTR hooks */
  if (!title.includes("Best") && post.views > 200) {
    newTitle = `Best ${title}`;
  }

  /* 🔥 Rule 3: add freshness signal */
  if (!title.includes("2026")) {
    newTitle = `${newTitle} - 2026 Updated`;
  }

  return newTitle;
}

/* ================= MAIN ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "blog"));

    const posts = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= 1. SCORE ALL ================= */
    const scored = posts.map(p => ({
      ...p,
      score: performanceScore(p),
    }));

    /* ================= 2. SELECT CANDIDATES ================= */

    const needsEvolution = scored.filter(p => p.score < 80);
    const stable = scored.filter(p => p.score >= 80);

    const changes = [];

    /* ================= 3. EVOLVE CONTENT ================= */

    for (const post of needsEvolution.slice(0, 15)) {
      try {
        const evolvedTitle = evolveContent(post);

        const changed = evolvedTitle !== post.title;

        if (changed) {
          await updateDoc(doc(db, "blog", post.id), {
            title: evolvedTitle,
            seoEvolved: true,
            lastEvolvedAt: serverTimestamp(),
          });

          changes.push({
            id: post.id,
            before: post.title,
            after: evolvedTitle,
          });
        }

      } catch (e) {
        changes.push({
          id: post.id,
          error: e.message,
        });
      }
    }

    /* ================= 4. REINFORCE HIGH PERFORMERS ================= */

    for (const post of stable.slice(0, 10)) {
      try {
        await updateDoc(doc(db, "blog", post.id), {
          seoBoost: true,
          priority: "STABLE",
          reinforcedAt: serverTimestamp(),
        });
      } catch {}
    }

    /* ================= 5. TRIGGER GLOBAL SYSTEM ================= */

    await fetch("https://koloonline.online/api/seo/v6-seo-brain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "blog" }),
    }).catch(() => {});

    await fetch("https://koloonline.online/api/seo/predictive-engine", {
      method: "POST",
    }).catch(() => {});

    /* ================= RESULT ================= */

    return res.status(200).json({
      success: true,
      total: posts.length,
      evolved: changes.length,
      changes,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
