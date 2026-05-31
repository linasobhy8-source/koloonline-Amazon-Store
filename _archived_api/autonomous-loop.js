import { aiGuard } from "../../../lib/ai-control";

import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

/* ================= FIREBASE INIT ================= */
const app = !getApps().length
  ? initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  : getApps()[0];

const db = getFirestore(app);

/* ================= MAIN ENGINE ================= */

export default async function handler(req, res) {
  try {
    // 🔴 GLOBAL AI KILL SWITCH
    if (typeof aiGuard !== "function" || !aiGuard()) {
      return res.status(200).json({
        success: false,
        message: "AI SYSTEM DISABLED",
        loop: [],
        meta: {
          status: "blocked",
          timestamp: Date.now(),
        },
      });
    }

    // ================= FETCH BLOGS =================
    const blogSnap = await getDocs(collection(db, "blog"));

    const posts = blogSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // ================= ANALYZE LOOP =================
    const updates = posts.map((p) => ({
      id: p.id,
      title: p.title || "untitled",
      views: p.views || 0,
      needsBoost: (p.views || 0) < 50,
      score: (p.views || 0) * 1 + (p.likes || 0) * 2,
    }));

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      loop: updates,
      meta: {
        totalPosts: posts.length,
        flagged: updates.filter((u) => u.needsBoost).length,
        engine: "autonomous-loop-v1",
        timestamp: Date.now(),
      },
    });

  } catch (e) {
    console.error("AUTONOMOUS LOOP ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e?.message || "Internal Server Error",
    });
  }
      }
