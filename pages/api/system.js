import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= SELF MEMORY CACHE ================= */
let MEMORY = {
  feed: null,
  ts: 0,
  patternBoost: {},
};

const CACHE_TIME = 60 * 1000;

/* ================= CORE SIGNALS ================= */
function signals(p) {
  const views = p.views || 0;
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;

  const ctr = views ? clicks / views : 0;
  const conv = clicks ? orders / clicks : 0;

  const freshness = p.createdAt
    ? Math.max(
        0,
        1 - (Date.now() - p.createdAt) / 86400000
      )
    : 0.5;

  return { views, clicks, orders, ctr, conv, freshness };
}

/* ================= AI CORE SCORE ================= */
function baseAI(p, s) {
  return (
    s.views * 0.2 +
    s.clicks * 1.8 +
    s.orders * 6 +
    s.ctr * 150 +
    s.conv * 250 +
    s.freshness * 70
  );
}

/* ================= VIRAL INTELLIGENCE ================= */
function viralAI(p, s) {
  const momentum =
    s.clicks * 0.6 +
    s.orders * 3 +
    s.views * 0.15;

  const trend =
    p.viralBoost ? 2.5 : p.trending ? 1.8 : 1;

  return momentum * trend;
}

/* ================= PROFIT ENGINE ================= */
function profitAI(p, s) {
  const price = Number(p.price || 0);
  const margin = price * 0.05;

  return margin * (s.orders + 1);
}

/* ================= SELF LEARNING BOOST ================= */
function memoryBoost(p) {
  return MEMORY.patternBoost[p.id] || 1;
}

/* ================= FINAL BRAIN ================= */
function finalAI(p) {
  const s = signals(p);

  const base = baseAI(p, s);
  const viral = viralAI(p, s);
  const profit = profitAI(p, s);

  const memory = memoryBoost(p);

  return (
    (base * 1.3 + viral * 1.7 + profit * 2.2) *
    memory *
    (p.viralBoost ? 1.5 : 1)
  );
}

/* ================= MEMORY UPDATE ================= */
function updateMemory(products) {
  products.slice(0, 10).forEach((p, i) => {
    const boost = 1 + (10 - i) * 0.05;
    MEMORY.patternBoost[p.id] = boost;
  });
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const { action } = req.query;

  try {
    if (action === "feed") {
      const page = Number(req.query.page || 1);
      const pageSize = 15;

      /* CACHE HIT */
      if (
        MEMORY.feed &&
        Date.now() - MEMORY.ts < CACHE_TIME
      ) {
        const start = (page - 1) * pageSize;

        return res.json({
          success: true,
          source: "v3-cache-ai",
          page,
          hasMore:
            start + pageSize < MEMORY.feed.length,
          data: MEMORY.feed.slice(
            start,
            start + pageSize
          ),
        });
      }

      /* FETCH */
      const snap = await getDocs(
        query(collection(db, "products"), limit(200))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      /* ================= AI BRAIN ================= */
      products = products.map((p) => {
        const score = finalAI(p);

        return {
          ...p,
          score,
          viralScore: viralAI(p, signals(p)),
          profitScore: profitAI(p, signals(p)),
          ctr: signals(p).ctr,
          conv: signals(p).conv,
        };
      });

      /* ================= SORT ================= */
      products.sort((a, b) => b.score - a.score);

      /* ================= MEMORY LEARN ================= */
      updateMemory(products);

      /* ================= SAVE MEMORY ================= */
      MEMORY = {
        feed: products,
        ts: Date.now(),
        patternBoost: MEMORY.patternBoost,
      };

      const start = (page - 1) * pageSize;

      return res.json({
        success: true,
        source: "AUTONOMOUS-AGENT-V3",
        page,
        hasMore:
          start + pageSize < products.length,
        intelligence: {
          learning: true,
          viralEngine: true,
          profitEngine: true,
        },
        data: products.slice(start, pageSize),
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
     }
