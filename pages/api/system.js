import { db } from "../../lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { productBrain } from "../../lib/ai/productBrain";
import { detectVirals } from "../../lib/ai/viralDetector";

// ================= CACHE LAYER =================
let CACHE = {
  feed: null,
  trending: null,
  viral: null,
  lastUpdate: 0,
};

const CACHE_TIME = 1000 * 60 * 5; // 5 minutes

// ================= HANDLER =================
export default async function handler(req, res) {
  try {
    const { action } = req.query;
    const now = Date.now();

    // ================= CACHE VALIDATION =================
    const isCacheValid = now - CACHE.lastUpdate < CACHE_TIME;

    // ================= FEED =================
    if (action === "feed") {
      if (isCacheValid && CACHE.feed) {
        return res.status(200).json({
          success: true,
          cached: true,
          data: CACHE.feed,
          viral: CACHE.viral,
        });
      }

      const snap = await getDocs(
        query(collection(db, "products"), limit(120))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // ================= AI PROCESSING =================
      try {
        products = productBrain(products);
      } catch (e) {
        console.error("productBrain error:", e.message);
      }

      let virals = [];
      try {
        virals = detectVirals(products);
      } catch (e) {
        console.error("viralDetector error:", e.message);
      }

      products.sort((a, b) => (b.score || 0) - (a.score || 0));

      const result = products.slice(0, 20);
      const viralResult = virals.slice(0, 5);

      // ================= SAVE CACHE =================
      CACHE = {
        feed: result,
        trending: CACHE.trending,
        viral: viralResult,
        lastUpdate: now,
      };

      return res.status(200).json({
        success: true,
        cached: false,
        data: result,
        viral: viralResult,
      });
    }

    // ================= TRENDING =================
    if (action === "trending") {
      if (isCacheValid && CACHE.trending) {
        return res.status(200).json({
          success: true,
          cached: true,
          trending: CACHE.trending,
        });
      }

      const snap = await getDocs(
        query(collection(db, "products"), limit(50))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // ================= AI =================
      try {
        products = productBrain(products);
      }
