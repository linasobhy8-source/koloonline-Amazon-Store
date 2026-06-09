import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";

import { productBrain } from "../../lib/ai/productBrain";
import { detectVirals } from "../../lib/ai/viralDetector";

/* ================= FIREBASE INIT (SAFE) ================= */
const app = getApps().length
  ? getApp()
  : initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

const db = getFirestore(app);

/* ================= SAFE PRODUCT NORMALIZER ================= */
const safe = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (v?.toDate) {
    try {
      return v.toDate().toISOString();
    } catch {
      return "";
    }
  }

  if (Array.isArray(v)) return v.map(safe).join(" ");

  return "";
};

const normalize = (p) => ({
  id: safe(p?.id),
  title: safe(p?.title),
  description: safe(p?.description),
  image: safe(p?.image),
  link: safe(p?.link),
  category: safe(p?.category),
  price: Number(p?.price || 0),
  score: Number(p?.score || 0),
  views: Number(p?.views || 0),
  clicks: Number(p?.clicks || 0),
  viralBoost: Boolean(p?.viralBoost),
});

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const { action } = req.query;

  try {
    /* ================= FEED ================= */
    if (action === "feed") {
      const snap = await getDocs(
        query(collection(db, "products"), limit(120))
      );

      let products = snap.docs.map((d) =>
        normalize({ id: d.id, ...d.data() })
      );

      products = productBrain(products || []);
      const virals = detectVirals(products || []);

      products.sort((a, b) => (b.score || 0) - (a.score || 0));

      return res.status(200).json({
        success: true,
        data: products.slice(0, 20),
        viral: virals.slice(0, 5),
      });
    }

    /* ================= TRENDING ================= */
    if (action === "trending") {
      const snap = await getDocs(
        query(collection(db, "products"), limit(50))
      );

      let products = snap.docs.map((d) =>
        normalize({ id: d.id, ...d.data() })
      );

      const trending = productBrain(products || [])
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10);

      return res.status(200).json({
        success: true,
        trending,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: String(error?.message || error),
    });
  }
        }
