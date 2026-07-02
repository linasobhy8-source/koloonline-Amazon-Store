import { db } from "../../lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { productBrain } from "../../lib/ai/productBrain";
import { detectVirals } from "../../lib/ai/viralDetector";

// ================= CACHE =================
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

      // ================= AI =================
      try {
        products = productBrain(products);
      } catch (e) {
        console.error("productBrain error:", e);
      }

      let virals = [];
      try {
        virals = detectVirals(products);
      } catch (e) {
        console.error("viralDetector error:", e);
      }

      products.sort((a, b) => (b.score || 0) - (a.score || 0));

      const result = products.slice(0, 20);
      const viralResult = virals.slice(0, 5);

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
      } catch (e) {
        console.error("productBrain error:", e);
      }

      const trending = products
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10);

      CACHE.trending = trending;
      CACHE.lastUpdate = now;

      return res.status(200).json({
        success: true,
        cached: false,
        trending,
      });
    }

    // ================= VIRAL ONLY =================
    if (action === "viral") {
      if (isCacheValid && CACHE.viral) {
        return res.status(200).json({
          success: true,
          cached: true,
          viral: CACHE.viral,
        });
      }

      const snap = await getDocs(
        query(collection(db, "products"), limit(100))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      let virals = [];
      try {
        virals = detectVirals(products);
      } catch (e) {
        console.error("viralDetector error:", e);
      }

      const viralResult = virals.slice(0, 10);

      CACHE.viral = viralResult;
      CACHE.lastUpdate = now;

      return res.status(200).json({
        success: true,
        cached: false,
        viral: viralResult,
      });
    }

    // ================= DEFAULT =================
    return res.status(400).json({
      success: false,
      message: "Invalid action. Use ?action=feed | trending | viral",
    });

  } catch (e) {
    console.error("SYSTEM ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
        }
