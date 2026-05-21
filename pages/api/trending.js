import {
  initializeApp,
  getApps,
  getApp,
} from "firebase/app";

import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,

  authDomain:
    process.env
      .NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,

  projectId:
    process.env
      .NEXT_PUBLIC_FIREBASE_PROJECT_ID,

  storageBucket:
    process.env
      .NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,

  messagingSenderId:
    process.env
      .NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    process.env
      .NEXT_PUBLIC_FIREBASE_APP_ID,
};

/* ================= INIT ================= */
const app =
  !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();

const db = getFirestore(app);

/* ================= HANDLER ================= */
export default async function handler(
  req,
  res
) {
  try {
    /* ================= FETCH ================= */
    const snap = await getDocs(
      collection(db, "products")
    );

    /* ================= AI TREND ENGINE ================= */
    const products = snap.docs
      .map((doc) => {
        const data = doc.data();

        const views =
          Number(data.views || 0);

        const clicks =
          Number(data.clicks || 0);

        const orders =
          Number(data.orders || 0);

        const rating =
          Number(data.rating || 4);

        const reviewCount =
          Number(
            data.reviewCount || 0
          );

        const viralBoost =
          data.viralBoost
            ? 50
            : 0;

        /* ================= CONVERSION ================= */
        const conversionRate =
          clicks > 0
            ? orders / clicks
            : 0;

        /* ================= AI SCORE ================= */
        const aiScore =
          views * 0.2 +
          clicks * 2 +
          orders * 8 +
          rating * 5 +
          reviewCount * 0.05 +
          conversionRate * 100 +
          viralBoost;

        /* ================= TREND LEVEL ================= */
        let trendLevel = "normal";

        if (aiScore > 150)
          trendLevel = "viral";

        else if (aiScore > 80)
          trendLevel = "hot";

        return {
          asin: doc.id,

          title:
            data.title ||
            "Amazon Product",

          image:
            data.image || "",

          category:
            data.category ||
            "general",

          price:
            Number(
              data.price || 0
            ),

          oldPrice:
            Number(
              data.oldPrice || 0
            ),

          rating,

          reviewCount,

          views,

          clicks,

          orders,

          conversionRate,

          aiScore,

          trendLevel,

          viralBoost:
            !!data.viralBoost,

          link:
            data.link || "",

          updatedAt:
            new Date().toISOString(),
        };
      })

      /* ================= SORT ================= */
      .sort(
        (a, b) =>
          b.aiScore - a.aiScore
      )

      /* ================= LIMIT ================= */
      .slice(0, 50);

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,

      total: products.length,

      generatedAt:
        new Date().toISOString(),

      products,
    });

  } catch (err) {
    console.error(
      "TRENDING API ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      error:
        err.message ||
        "Internal Server Error",
    });
  }
}
