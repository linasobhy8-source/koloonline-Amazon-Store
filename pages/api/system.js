import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";

import { productBrain } from "../../lib/ai/productBrain";
import { detectVirals } from "../../lib/ai/viralDetector";

/* ================= FIREBASE INIT ================= */
const app = !getApps().length
  ? initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
  : getApps()[0];

const db = getFirestore(app);

/* ================= SAFE HANDLER ================= */
export default async function handler(req, res) {
  const { action } = req.query;

  try {
    /* ================= FEED MODE ================= */
    if (action === "feed") {
      const snap = await getDocs(
        query(collection(db, "products"), limit(120))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // تحسين البيانات وترتيب الجودة
      products = productBrain(products);

      // استخراج المنتجات ذات الأداء العالي
      const virals = detectVirals(products);

      // ترتيب حسب الأداء العام
      products.sort((a, b) => (b.score || 0) - (a.score || 0));

      return res.status(200).json({
        success: true,
        data: products.slice(0, 20),
        viral: virals.slice(0, 5),
        description:
          "This endpoint returns curated product listings ranked by performance signals such as engagement and relevance. It also highlights high-performing products for better discovery.",
      });
    }

    /* ================= TRENDING MODE ================= */
    if (action === "trending") {
      const snap = await getDocs(
        query(collection(db, "products"), limit(50))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const trending = productBrain(products)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10);

      return res.status(200).json({
        success: true,
        trending,
        description:
          "This endpoint provides a simplified list of trending products based on engagement signals and content relevance.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action parameter",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
        }
