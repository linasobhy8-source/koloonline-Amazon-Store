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

/* ================= CTR MODEL ================= */
function ctrScore(p) {
  const views = p.views || 0;
  const clicks = p.clicks || 0;

  return views > 0 ? clicks / views : 0;
}

/* ================= TRAFFIC VALUE ================= */
function trafficValue(p) {
  const ctr = ctrScore(p);
  const views = p.views || 0;

  let value = views * ctr;

  // boost for SEO optimized content
  if (p.seoBoost) value *= 1.2;
  if (p.discoverBoost) value *= 1.5;
  if (p.viralScore > 80) value *= 1.7;

  return value;
}

/* ================= TITLE OPTIMIZER ================= */
function optimizeTitle(title, ctr) {
  let newTitle = title;

  if (ctr < 0.02 && !title.includes("Best")) {
    newTitle = `Best ${title}`;
  }

  if (ctr < 0.01 && !title.includes("2026")) {
    newTitle = `${newTitle} (Updated 2026)`;
  }

  if (ctr > 0.05 && !title.includes("Top")) {
    newTitle = `Top ${newTitle}`;
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

    /* ================= 1. CALCULATE TRAFFIC VALUE ================= */

    const scored = posts.map(p => ({
      ...p,
      ctr: ctrScore(p),
      traffic: trafficValue(p),
    }));

    /* ================= 2. CLASSIFY ================= */

    const winners = scored
      .sort((a, b) => b.traffic - a.traffic)
      .slice(0, 10);

    const losers = scored
      .sort((a, b) => a.traffic - b.traffic)
      .slice(0, 10);

    const changes = [];

    /* ================= 3. BOOST WINNERS ================= */

    for (const post of winners) {
      try {
        await updateDoc(doc(db, "blog", post.id), {
          trafficBoost: true,
          priority: "HIGH_TRAFFIC",
          lastTrafficBoost: serverTimestamp(),
        });
      } catch {}
    }

    /* ================= 4. FIX LOSERS ================= */

    for (const post of losers) {
      try {
        const newTitle = optimizeTitle(post.title, post.ctr);

        const changed = newTitle !== post.title;

        if (changed) {
          await updateDoc(doc(db, "blog", post.id), {
            title: newTitle,
            trafficOptimized: true,
            lastTrafficFix: serverTimestamp(),
          });

          changes.push({
            id: post.id,
            before: post.title,
            after: newTitle,
            ctr: post.ctr,
          });
        }

      } catch (e) {
        changes.push({
          id: post.id,
          error: e.message,
        });
      }
    }

    /* ================= 5. REBALANCE SEO SYSTEM ================= */

    await fetch("https://koloonline.online/api/seo/self-evolving-ai", {
      method: "POST",
    }).catch(() => {});

    await fetch("https://koloonline.online/api/seo/predictive-engine", {
      method: "POST",
    }).catch(() => {});

    await fetch("https://koloonline.online/api/seo/autonomous-loop", {
      method: "POST",
    }).catch(() => {});

    /* ================= RESULT ================= */

    return res.status(200).json({
      success: true,
      total: posts.length,
      winners: winners.map(p => ({
        id: p.id,
        traffic: p.traffic,
      })),
      losersFixed: changes,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
