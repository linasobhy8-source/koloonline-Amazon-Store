import { aiGuard } from "@/lib/ai-control";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

/* ================= FIREBASE ================= */
const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

const db = getFirestore(app);

/* ================= TREND SCORE ================= */
function score(p) {
  return (
    (p.views || 0) +
    (p.clicks || 0) * 2 +
    (p.orders || 0) * 5 +
    (p.viralBoost ? 50 : 0)
  );
}

/* ================= KEYWORD BOOST ================= */
function keywordBoost(title = "") {
  const t = title.toLowerCase();

  if (t.includes("2026")) return 40;
  if (t.includes("best")) return 30;
  if (t.includes("cheap")) return 20;
  if (t.includes("viral")) return 50;

  return 10;
}

/* ================= ENGINE ================= */
export default async function handler(req, res) {
  try {
    if (!aiGuard()) {
      return res.status(200).json({
        success: false,
        message: "AI OFF",
      });
    }

    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= AI RANKING ================= */
    products = products.map((p) => {
      const aiScore =
        score(p) + keywordBoost(p.title);

      return {
        ...p,
        aiScore,
      };
    });

    const topProducts = products
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 10);

    /* ================= AUTO BLOG GENERATION ================= */
    for (const p of topProducts.slice(0, 3)) {
      await addDoc(collection(db, "blog_queue"), {
        title: `🔥 Why ${p.title} is Trending in 2026`,
        productId: p.id,
        createdAt: serverTimestamp(),
        status: "pending",
      });
    }

    /* ================= LOG ================= */
    await addDoc(collection(db, "system_logs"), {
      type: "autonomous_run",
      topCount: topProducts.length,
      createdAt: serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      topProducts,
      message: "AUTONOMOUS CYCLE COMPLETE",
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
