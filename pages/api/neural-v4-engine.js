import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= AMAZON NEURAL v4 ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let updated = 0;
    const hour = new Date().getHours();

    for (const d of snap.docs) {
      const p = d.data();

      const clicks = Number(p.clicks || 0);
      const orders = Number(p.orders || 0);
      const views = Number(p.views || 0);
      const rating = Number(p.rating || 3);
      const price = Number(p.price || 0);
      const category = p.category || "general";

      /* ================= 1. BASE NEURAL SCORE ================= */
      let score =
        clicks * 1.3 +
        orders * 6 +
        views * 0.35 +
        rating * 2;

      /* ================= 2. CONVERSION INTELLIGENCE ================= */
      const conversion = clicks > 0 ? orders / clicks : 0;

      if (conversion > 0.25) score += 12;
      else if (conversion > 0.15) score += 6;

      /* ================= 3. TIME-AWARE LEARNING ================= */
      // morning boost (shopping peak)
      if (hour >= 9 && hour <= 14) score *= 1.1;

      // night browsing boost
      if (hour >= 20 || hour <= 2) score *= 1.2;

      /* ================= 4. PRICE STRATEGY ================= */
      if (price > 0 && price < 50) score += 4;
      if (price > 0 && price < 20) score += 6;
      if (price > 200) score -= 3;

      /* ================= 5. CATEGORY MOMENTUM ================= */
      if (category === "electronics") score += 2;
      if (category === "fashion") score += 1;

      /* ================= 6. DEAD PRODUCT DETECTION ================= */
      if (views > 30 && clicks === 0) score -= 10;
      if (views > 60 && orders === 0) score -= 15;

      /* ================= 7. VIRAL BOOST ================= */
      if (clicks > 50) score += 10;
      if (orders > 10) score += 15;

      /* ================= 8. TREND SIGNAL ================= */
      const trendSignal =
        (p.recentClicks || 0) + (p.recentOrders || 0) * 2;

      score += trendSignal * 0.5;

      /* ================= FINAL SAFETY ================= */
      if (!isFinite(score) || isNaN(score)) {
        score = rating * 2;
      }

      const isHot = score > 30;
      const isDead = score < 5;

      /* ================= UPDATE PRODUCT ================= */
      await updateDoc(doc(db, "products", d.id), {
        score,
        isHot,
        isDead,
        conversionRate: conversion,
        lastNeuralUpdate: serverTimestamp(),
      });

      updated++;
    }

    return res.status(200).json({
      success: true,
      message: "🔥 Amazon Neural v4 Completed",
      updated,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
        }
