import { aiGuard } from "../lib/ai-control";

/* ================= GLOBAL AI GUARD ================= */
aiGuard();

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

/* ================= FIREBASE ================= */

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const db = getFirestore(app);

/* ================= SAFE HELPERS ================= */

const num = (v) => Number(v || 0);

/* ================= SYSTEM METRICS ================= */

function engagementScore(p) {
  return (
    num(p.clicks) * 2 +
    num(p.views) * 0.5 +
    num(p.orders) * 10
  );
}

function conversionRate(p) {
  return num(p.clicks) > 0
    ? num(p.orders) / num(p.clicks)
    : 0;
}

function freshnessBoost(p) {
  const now = Date.now();
  const updated = p.updatedAt
    ? new Date(p.updatedAt).getTime()
    : now;

  const hours =
    (now - updated) / (1000 * 60 * 60);

  return Math.max(0, 40 - hours * 0.5);
}

/* ================= EVOLUTION ENGINE ================= */

function evolveProduct(p) {
  const engagement = engagementScore(p);
  const ctr =
    num(p.clicks) > 0
      ? num(p.clicks) / num(p.views)
      : 0;

  const cvr = conversionRate(p);
  const fresh = freshnessBoost(p);

  let score =
    engagement * 0.6 +
    ctr * 80 +
    cvr * 120 +
    fresh;

  /* ================= MUTATIONS ================= */

  if (p.viralBoost) score *= 1.25;

  if (num(p.price) > 100) score += 20;

  if (engagement < 10) score *= 0.7;

  return {
    ...p,
    evolvedScore: score,
    ctr,
    cvr,
    freshness: fresh,
  };
}

/* ================= HANDLER ================= */

export default async function handler(
  req,
  res
) {
  try {
    /* ================= SAFE TOGGLE ================= */
    if (process.env.AI_MODE !== "true") {
      return res.status(200).json({
        success: false,
        message: "AI MODE DISABLED",
      });
    }

    const snap = await getDocs(
      collection(db, "products")
    );

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= VALIDATION ================= */
    products = products.filter(
      (p) => p.id && p.title
    );

    /* ================= EVOLVE ================= */
    const evolved = products.map(evolveProduct);

    /* ================= SORT ================= */
    evolved.sort(
      (a, b) =>
        b.evolvedScore - a.evolvedScore
    );

    const topEvolved = evolved.slice(0, 20);

    /* ================= WRITE BACK ================= */

    for (const p of topEvolved) {
      const ref = doc(
        db,
        "products",
        p.id
      );

      await updateDoc(ref, {
        evolvedScore: p.evolvedScore,
        ctr: p.ctr,
        cvr: p.cvr,
        freshness: p.freshness,
        lastEvolvedAt:
          new Date().toISOString(),
      });
    }

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      cycle: "self-evolving-v1",
      updated: topEvolved.length,
      timestamp: Date.now(),
      topEvolved,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
