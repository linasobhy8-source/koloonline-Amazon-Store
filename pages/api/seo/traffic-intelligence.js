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

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= CORE METRICS ================= */
const ctr = (p) => (p.views > 0 ? p.clicks / p.views : 0);

const engagementScore = (p) => {
  const views = p.views || 0;
  const clicks = p.clicks || 0;

  let score = views * 0.2 + clicks * 1.2 + ctr(p) * 300;

  if (p.trafficBoost) score *= 1.2;
  if (p.seoBoost) score *= 1.1;
  if (p.viralScore > 80) score *= 1.5;

  return score;
};

/* ================= CLASSIFIER ================= */
function classify(p) {
  const c = ctr(p);
  const e = engagementScore(p);

  if (e > 500 && c > 0.05) return "VIRAL";
  if (e > 200) return "GROWING";
  if (e > 80) return "STABLE";
  return "DEAD";
}

/* ================= TITLE SMART FIX ================= */
function improveTitle(title, type) {
  let t = title || "";

  if (type === "DEAD" && !t.includes("Guide")) {
    t = `${t} (Complete Guide 2026)`;
  }

  if (type === "GROWING" && !t.includes("Best")) {
    t = `Best ${t}`;
  }

  if (type === "VIRAL" && !t.includes("Top")) {
    t = `Top Trending ${t}`;
  }

  return t;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    console.log("🧠 Traffic Intelligence Started");

    const snap = await getDocs(collection(db, "blog"));

    const posts = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const results = [];

    /* ================= ANALYZE ================= */
    for (const post of posts) {
      const c = ctr(post);
      const score = engagementScore(post);
      const status = classify(post);

      let updatePayload = {
        trafficStatus: status,
        ctr: c,
        engagementScore: score,
        lastAnalyzed: serverTimestamp(),
      };

      /* ================= ACTION RULES ================= */

      // 🔥 VIRAL → amplify
      if (status === "VIRAL") {
        updatePayload.trafficBoost = true;
        updatePayload.priority = "MAX";
      }

      // 📈 GROWING → optimize
      if (status === "GROWING") {
        updatePayload.seoBoost = true;
        updatePayload.title = improveTitle(post.title, status);
      }

      // 🧠 DEAD → fix content
      if (status === "DEAD") {
        const newTitle = improveTitle(post.title, status);

        if (newTitle !== post.title) {
          updatePayload.title = newTitle;
          updatePayload.seoRewritten = true;
        }
      }

      try {
        await updateDoc(doc(db, "blog", post.id), updatePayload);

        results.push({
          id: post.id,
          status,
          ctr: c,
          score,
        });
      } catch (e) {
        results.push({
          id: post.id,
          error: e.message,
        });
      }
    }

    /* ================= TRIGGER NEXT LAYER ================= */

    await fetch(
      "https://koloonline.online/api/seo/v6-seo-brain",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "blog" }),
      }
    ).catch(() => {});

    console.log("✅ Traffic Intelligence Done");

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      total: posts.length,
      analyzed: results.length,
      results,
    });
  } catch (e) {
    console.error("❌ Traffic Intelligence Error:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
