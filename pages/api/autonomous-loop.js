import { aiGate } from "../lib/ai-control";

import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

/* ================= FIREBASE ================= */
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
    if (!aiGate()) {
      return res.status(200).json({
        success: false,
        message: "AI SYSTEM DISABLED",
        loop: [],
      });
    }

    const blogSnap = await getDocs(collection(db, "blog"));

    const posts = blogSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    const updates = posts.map(p => ({
      id: p.id,
      needsBoost: (p.views || 0) < 50,
    }));

    return res.status(200).json({
      success: true,
      loop: updates,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
      }
