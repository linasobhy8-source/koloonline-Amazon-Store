import { initializeApp, getApps } from "firebase/app";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

/* ================= FIREBASE INIT ================= */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,

  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,

  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,

  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,

  messagingSenderId:
    process.env
      .NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= SAFE USER KEY ================= */

function generateUserKey(req) {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket?.remoteAddress ||
    "unknown";

  const ua =
    req.headers["user-agent"] || "unknown";

  return Buffer.from(`${ip}-${ua}`)
    .toString("base64")
    .slice(0, 120);
}

/* ================= MAIN HANDLER ================= */

export default async function handler(req, res) {
  try {
    /* ================= METHOD ================= */

    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }

    /* ================= BODY ================= */

    const { type, asin } = req.body || {};

    if (!type || !asin) {
      return res.status(400).json({
        success: false,
        error: "Missing asin or type",
      });
    }

    /* ================= ALLOWED TYPES ================= */

    const allowedTypes = [
      "view",
      "click",
      "order",
      "affiliate_click",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Invalid type",
      });
    }

    /* ================= USER ================= */

    const userKey = generateUserKey(req);

    const userRef = doc(
      db,
      "analytics_users",
      userKey
    );

    const userSnap = await getDoc(userRef);

    const now = Date.now();

    /* ================= RATE LIMIT ================= */

    if (userSnap.exists()) {
      const data = userSnap.data();

      const lastAction =
        data.lastAction || 0;

      const lastType =
        data.lastType || "";

      const isSpamClick =
        type === "click" &&
        lastType === "click" &&
        now - lastAction < 12000;

      const isSpamView =
        type === "view" &&
        lastType === "view" &&
        now - lastAction < 3000;

      if (isSpamClick || isSpamView) {
        return res.status(429).json({
          success: false,
          message: "Spam blocked",
        });
      }
    }

    /* ================= GEO ================= */

    const country =
      req.headers["x-vercel-ip-country"] ||
      "unknown";

    const city =
      req.headers["x-vercel-ip-city"] ||
      "unknown";

    /* ================= UPDATE USER ================= */

    await setDoc(
      userRef,
      {
        lastAction: now,

        lastType: type,

        country,

        city,

        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    /* ================= PRODUCT ================= */

    const productRef = doc(
      db,
      "analytics_products",
      asin
    );

    const productSnap =
      await getDoc(productRef);

    if (!productSnap.exists()) {
      await setDoc(productRef, {
        clicks: 0,

        views: 0,

        orders: 0,

        affiliateClicks: 0,

        aiScore: 0,

        trendBoost: 0,

        conversionRate: 0,

        isHotProduct: false,

        createdAt: serverTimestamp(),
      });
    }

    /* ================= UPDATE ================= */

    const updates = {
      lastUpdated: serverTimestamp(),
    };

    if (type === "view") {
      updates.views = increment(1);
    }

    if (
      type === "click" ||
      type === "affiliate_click"
    ) {
      updates.clicks = increment(1);

      updates.affiliateClicks =
        increment(1);
    }

    if (type === "order") {
      updates.orders = increment(1);
    }

    await updateDoc(productRef, updates);

    /* ================= RECALCULATE ================= */

    const updatedSnap =
      await getDoc(productRef);

    const data = updatedSnap.data();

    const views = data.views || 0;

    const clicks = data.clicks || 0;

    const orders = data.orders || 0;

    const conversionRate =
      clicks > 0
        ? Number(
            (orders / clicks).toFixed(2)
          )
        : 0;

    /* ================= AI ENGINE ================= */

    let trendBoost = 0;

    if (views > 50) trendBoost += 5;

    if (views > 300) trendBoost += 10;

    if (clicks > 20) trendBoost += 15;

    if (orders > 3) trendBoost += 25;

    if (orders > 10) trendBoost += 40;

    if (conversionRate > 0.1)
      trendBoost += 20;

    if (conversionRate > 0.2)
      trendBoost += 40;

    const aiScore =
      views * 0.2 +
      clicks * 1.5 +
      orders * 10 +
      conversionRate * 100 +
      trendBoost;

    const isHotProduct =
      aiScore >= 80;

    /* ================= SAVE AI ================= */

    await updateDoc(productRef, {
      conversionRate,

      aiScore,

      trendBoost,

      isHotProduct,
    });

    /* ================= PROFIT SIGNALS ================= */

    await setDoc(
      doc(db, "profit_signals", asin),

      {
        asin,

        aiScore,

        trendBoost,

        conversionRate,

        isHotProduct,

        updatedAt: serverTimestamp(),
      },

      { merge: true }
    );

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,

      asin,

      type,

      country,

      city,

      aiScore,

      trendBoost,

      isHotProduct,
    });
  } catch (err) {
    console.error(
      "TRACK EVENT ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      error:
        err?.message ||
        "Internal Server Error",
    });
  }
  }
