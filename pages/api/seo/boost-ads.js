import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= QUALITY SCORER ================= */
function calculateAdScore({ type, id, url }) {
  let score = 50; // base

  // URL quality
  if (url?.includes("/blog/")) score += 25;
  if (url?.includes("/product/")) score += 20;

  // type signals
  if (type === "blog") score += 10;
  if (type === "product") score += 15;

  // ID strength
  if (id && id.length > 5) score += 5;

  // safe cap
  return Math.min(100, score);
}

/* ================= AD SLOT ENGINE ================= */
function generateAdsSlots(score) {
  const slots = [];

  if (score >= 40) slots.push("under_title");
  if (score >= 60) slots.push("under_price");
  if (score >= 75) slots.push("mid_content");
  if (score >= 85) slots.push("sticky_sidebar");

  return slots;
}

/* ================= ELIGIBILITY ================= */
function isAdsEligible(score) {
  return score >= 45; // threshold for AdSense safe display
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { type, id, url } = req.body || {};

    if (!type || !id || !url) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    /* ================= SCORE ================= */
    const adScore = calculateAdScore({ type, id, url });
    const adsSlots = generateAdsSlots(adScore);
    const eligible = isAdsEligible(adScore);

    /* ================= SAVE SIGNAL ================= */
    await setDoc(doc(db, "ads_signals", `${type}_${id}`), {
      type,
      id,
      url,
      adScore,
      adsSlots,
      eligible,
      createdAt: serverTimestamp(),
    });

    console.log("💰 ADS BOOST:", {
      url,
      adScore,
      eligible,
      adsSlots,
    });

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      adScore,
      eligible,
      adsSlots,
      recommendation: eligible
        ? "SHOW_ADS"
        : "HIDE_OR_LIMIT_ADS",
    });

  } catch (e) {
    console.error("ADS BOOST ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
  }
