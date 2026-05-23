import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= FIREBASE SAFE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= AI SCORING CORE ================= */
function scoreProduct(p) {
  let score = 0;

  const views = p.views || 0;
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;
  const price = p.price || 0;

  /* ===== ENGAGEMENT ===== */
  score += views * 0.2;
  score += clicks * 2;
  score += orders * 8;

  /* ===== CONVERSION ===== */
  const ctr = views ? clicks / views : 0;
  const cvr = clicks ? orders / clicks : 0;

  score += ctr * 150;
  score += cvr * 300;

  /* ===== PRICE SWEET SPOT ===== */
  if (price >= 15 && price <= 80) score += 25;
  else if (price > 80) score -= 10;

  /* ===== VIRAL SIGNAL ===== */
  if (p.viralBoost) score += 70;

  /* ===== CATEGORY BOOST ===== */
  const winners = [
    "electronics",
    "gadgets",
    "smart watch",
    "headphones",
    "gaming",
    "fitness",
    "home",
    "kitchen",
  ];

  if (winners.includes((p.category || "").toLowerCase())) {
    score += 30;
  }

  return score;
}

/* ================= DECISION ENGINE ================= */
function decide(score) {
  if (score >= 130) return "🔥 AUTO_APPROVE";
  if (score >= 90) return "⚡ QUEUE";
  if (score >= 60) return "🟡 REVIEW";
  return "❌ REJECT";
}

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const results = [];

    for (const doc of snap.docs) {
      const product = { id: doc.id, ...doc.data() };

      const score = scoreProduct(product);
      const action = decide(score);

      /* ================= LOG DECISION ================= */
      await addDoc(collection(db, "gatekeeper_logs"), {
        productId: product.id,
        title: product.title || "",
        score,
        decision: action,
        createdAt: serverTimestamp(),
      });

      /* ================= ONLY WINNERS ENTER SYSTEM ================= */
      if (action === "🔥 AUTO_APPROVE") {
        await addDoc(collection(db, "home_feed"), {
          ...product,
          aiBoost: true,
          createdAt: serverTimestamp(),
        });

        await addDoc(collection(db, "approved_products"), {
          ...product,
          score,
          createdAt: serverTimestamp(),
        });
      }

      results.push({
        id: product.id,
        score,
        action,
      });
    }

    return res.status(200).json({
      success: true,
      total: results.length,
      approved: results.filter(r => r.action === "🔥 AUTO_APPROVE").length,
      results,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
