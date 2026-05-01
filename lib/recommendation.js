import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= AI SCORE ENGINE ================= */
export async function getRecommendations(userId, products) {
  const userRef = doc(db, "user_behavior", userId);
  const snap = await getDoc(userRef);

  const user = snap.exists() ? snap.data() : {};

  const views = user.views || [];
  const clicks = user.clicks || [];
  const purchases = user.purchases || [];
  const categories = user.categories || [];

  const scored = products.map((p) => {
    let score = 0;

    /* 🔥 1. Purchase أهم حاجة */
    if (purchases.includes(p.asin)) score += 10;

    /* 🔥 2. Click */
    if (clicks.includes(p.asin)) score += 6;

    /* 🔥 3. View */
    if (views.includes(p.asin)) score += 3;

    /* 🔥 4. Category match */
    if (categories.includes(p.category)) score += 4;

    /* 🔥 5. Price boost (رخيص = فرصة أعلى) */
    const price = Number(p.price) || 0;
    if (price < 50) score += 2;
    if (price < 20) score += 3;

    return {
      ...p,
      aiScore: score,
    };
  });

  /* ترتيب ذكي */
  return scored.sort((a, b) => b.aiScore - a.aiScore);
}
