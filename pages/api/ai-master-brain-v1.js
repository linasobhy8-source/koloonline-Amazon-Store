import { aiGuard } from "../lib/ai-control";

/* ================= GLOBAL AI SWITCH ================= */
aiGuard();

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";

/* ================= FIREBASE ================= */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const db = getFirestore(app);

/* ================= BRAIN DECISION ENGINE ================= */

function decideSystemState(products, blogs) {
  const productCount = products.length;
  const blogCount = blogs.length;

  // ================= SAFE RULES =================
  if (productCount < 10) return "BOOST_PRODUCTS";
  if (blogCount < 5) return "BOOST_CONTENT";
  if (productCount > 50 && blogCount > 20) return "OPTIMIZE_REVENUE";

  return "STABLE";
}

/* ================= HANDLER ================= */

export default async function handler(req, res) {
  try {
    /* ================= FETCH DATA ================= */
    const productSnap = await getDocs(
      collection(db, "products")
    );

    const blogSnap = await getDocs(
      collection(db, "blog")
    );

    const products = productSnap.docs.map(
      (d) => d.data()
    );

    const blogs = blogSnap.docs.map(
      (d) => d.data()
    );

    /* ================= DECISION ================= */
    const state = decideSystemState(
      products,
      blogs
    );

    /* ================= ACTION ENGINE ================= */

    let actions = [];

    switch (state) {
      case "BOOST_PRODUCTS":
        actions = [
          "ai-product-filter-v1",
          "ai-profit-predictor-v1",
        ];
        break;

      case "BOOST_CONTENT":
        actions = [
          "auto-blog-generator-v2",
        ];
        break;

      case "OPTIMIZE_REVENUE":
        actions = [
          "ai-learning-loop-v1",
        ];
        break;

      default:
        actions = ["system-idle"];
    }

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      state,
      stats: {
        products: products.length,
        blogs: blogs.length,
      },
      actions,
      timestamp: Date.now(),
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
