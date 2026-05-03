import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const asin = req.query.asin;

    if (!asin) {
      return res.status(400).json({
        success: false,
        error: "asin is required"
      });
    }

    const ref = doc(db, "product_relations", asin);
    const snap = await getDoc(ref);

    /* ================= NO DATA ================= */
    if (!snap.exists()) {
      return res.status(200).json({
        success: true,
        asin,
        alsoViewed: [],
        boughtTogether: [],
        recommended: [],
        message: "No relations found (AI will generate soon)"
      });
    }

    const data = snap.data();

    /* ================= SAFE RESPONSE ================= */
    return res.status(200).json({
      success: true,
      asin,
      alsoViewed: data.alsoViewed || [],
      boughtTogether: data.boughtTogether || [],
      recommended: data.recommended || []
    });

  } catch (err) {
    console.error("GET RECOMMENDATIONS ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
