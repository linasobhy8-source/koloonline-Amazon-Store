import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= METRICS ================= */
function calcBlogValue(b) {
  const views = b.views || 0;
  const clicks = b.clicks || 0;
  const ctr = views > 0 ? clicks / views : 0;

  return views * ctr * 2 + clicks;
}

function calcProductValue(p) {
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;
  const price = p.price || 0;

  return clicks * 1.5 + orders * 10 + price * 0.1;
}

/* ================= MAIN ================= */
export default async function handler(req, res) {
  try {

    const blogSnap = await getDocs(collection(db, "blog"));
    const productSnap = await getDocs(collection(db, "products"));

    const blogs = blogSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    const products = productSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= 1. SCORE SYSTEM ================= */

    const blogScores = blogs.map(b => ({
      ...b,
      score: calcBlogValue(b),
    }));

    const productScores = products.map(p => ({
      ...p,
      score: calcProductValue(p),
    }));

    /* ================= 2. BUSINESS DECISIONS ================= */

    const decisions = [];

    const topBlogs = blogScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const weakBlogs = blogScores
      .sort((a, b) => a.score - b.score)
      .slice(0, 10);

    const topProducts = productScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const weakProducts = productScores
      .sort((a, b) => a.score - b.score)
      .slice(0, 10);

    /* ================= 3. STRATEGIC ACTIONS ================= */

    // BOOST WINNERS
    for (const b of topBlogs) {
      await updateDoc(doc(db, "blog", b.id), {
        businessTier: "CORE",
        priority: "HIGH",
        updatedAt: serverTimestamp(),
      });
    }

    for (const p of topProducts) {
      await updateDoc(doc(db, "products", p.id), {
        businessTier: "CORE_PRODUCT",
        revenuePriority: "HIGH",
        updatedAt: serverTimestamp(),
      });
    }

    // MARK LOSERS
    for (const b of weakBlogs) {
      await updateDoc(doc(db, "blog", b.id), {
        businessTier: "LOW",
        needsRewrite: true,
        updatedAt: serverTimestamp(),
      });
    }

    for (const p of weakProducts) {
      await updateDoc(doc(db, "products", p.id), {
        businessTier: "LOW",
        needsBoost: true,
        updatedAt: serverTimestamp(),
      });
    }

    /* ================= 4. STRATEGY SIGNALS ================= */

    const blogHealth =
      topBlogs.reduce((a, b) => a + b.score, 0) /
      (weakBlogs.reduce((a, b) => a + b.score, 0) + 1);

    const productHealth =
      topProducts.reduce((a, b) => a + b.score, 0) /
      (weakProducts.reduce((a, b) => a + b.score, 0) + 1);

    let strategy = "BALANCED";

    if (blogHealth > 2) strategy = "CONTENT_EXPANSION";
    if (productHealth > 2) strategy = "MONETIZATION_FOCUS";
    if (blogHealth < 1) strategy = "REBUILD_CONTENT";

    /* ================= 5. TRIGGER FULL SYSTEM ================= */

    await fetch("https://koloonline.online/api/seo/traffic-os", {
      method: "POST",
    }).catch(() => {});

    await fetch("https://koloonline.online/api/seo/revenue-os", {
      method: "POST",
    }).catch(() => {});

    /* ================= RESULT ================= */

    return res.status(200).json({
      success: true,

      strategy,

      topBlogs: topBlogs.slice(0, 5).map(b => ({
        id: b.id,
        score: b.score,
      })),

      topProducts: topProducts.slice(0, 5).map(p => ({
        id: p.id,
        score: p.score,
      })),

      weakBlogs: weakBlogs.slice(0, 5).map(b => ({
        id: b.id,
        score: b.score,
      })),

      weakProducts: weakProducts.slice(0, 5).map(p => ({
        id: p.id,
        score: p.score,
      })),
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
