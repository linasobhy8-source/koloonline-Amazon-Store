import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp
} from "firebase/firestore";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= USER FINGERPRINT ================= */
function generateUserKey(req) {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "unknown";

  const ua = req.headers["user-agent"] || "unknown";

  return Buffer.from(ip + ua).toString("base64");
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {

    if (req.method !== "POST") {
      return res.status(405).json({ success: false });
    }

    const { type, asin } = req.body;

    if (!type || !asin) {
      return res.status(400).json({ error: "missing data" });
    }

    const allowedTypes = ["view", "click", "order"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: "invalid type" });
    }

    /* ================= USER ================= */
    const userKey = generateUserKey(req);
    const userRef = doc(db, "analytics_users", userKey);
    const userSnap = await getDoc(userRef);

    const now = Date.now();

    /* ================= FRAUD PROTECTION ================= */
    if (userSnap.exists()) {
      const lastAction = userSnap.data().lastAction || 0;

      if (now - lastAction < 30000 && type === "click") {
        return res.status(429).json({
          success: false,
          message: "spam blocked"
        });
      }
    }

    /* ================= 🌍 COUNTRY TRACKING ================= */
    const country =
      req.headers["x-vercel-ip-country"] || "unknown";

    /* ================= UPDATE USER ================= */
    await setDoc(
      userRef,
      {
        lastAction: now,
        lastType: type,
        country
      },
      { merge: true }
    );

    /* ================= PRODUCT ================= */
    const productRef = doc(db, "analytics_products", asin);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      await setDoc(productRef, {
        clicks: 0,
        views: 0,
        orders: 0,
        createdAt: serverTimestamp()
      });
    }

    /* ================= UPDATE STATS ================= */
    const updates = {
      lastUpdated: serverTimestamp()
    };

    if (type === "view") updates.views = increment(1);
    if (type === "click") updates.clicks = increment(1);
    if (type === "order") updates.orders = increment(1);

    await updateDoc(productRef, updates);

    /* ================= AI SCORE ================= */
    const snap = await getDoc(productRef);
    const data = snap.data();

    const clicks = data.clicks || 0;
    const orders = data.orders || 0;
    const views = data.views || 0;

    const conversionRate = clicks > 0 ? orders / clicks : 0;

    const aiScore =
      views * 0.2 +
      clicks * 1.5 +
      orders * 8 +
      conversionRate * 100;

    const isHotProduct = aiScore > 50;

    await updateDoc(productRef, {
      conversionRate,
      aiScore,
      isHotProduct
    });

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      type,
      asin,
      country,
      aiScore,
      isHotProduct
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
      }
