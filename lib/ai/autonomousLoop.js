import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { saveTopProducts } from "./saveTopProducts";

/* ================= AUTONOMOUS LOOP ENGINE ================= */
export async function autonomousLoop() {
  const snap = await getDocs(collection(db, "products"));

  let products = snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

  /* ================= 1. VIRAL DETECTION ================= */
  products = products.map(p => {
    const velocity = (p.clicks || 0) + (p.orders || 0);
    const ctr = p.views ? p.clicks / p.views : 0;

    const viralScore =
      velocity * 2 +
      ctr * 150 +
      (p.viralBoost ? 100 : 0);

    return { ...p, viralScore };
  });

  /* ================= 2. AUTO BOOST ================= */
  const topViral = products
    .sort((a, b) => b.viralScore - a.viralScore)
    .slice(0, 5);

  for (const p of topViral) {
    await setDoc(doc(db, "products", p.id), {
      ...p,
      viralBoost: true,
      boostedAt: Date.now(),
    }, { merge: true });
  }

  /* ================= 3. SAVE TOP ================= */
  await saveTopProducts(products);

  return {
    success: true,
    boosted: topViral.length
  };
}
