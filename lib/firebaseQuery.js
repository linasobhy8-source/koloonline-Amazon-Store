// firebaseQuery.js

import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= SIMPLE MEMORY CACHE ================= */
let cache = null;
let lastFetch = 0;
let inFlight = null;

const CACHE_TIME = 1000 * 60 * 5; // 5 minutes

/* ================= FAST + OPTIMIZED ================= */
export async function getProductsFast() {
  const now = Date.now();

  /* 🔥 Return cache if valid */
  if (cache && now - lastFetch < CACHE_TIME) {
    return cache;
  }

  /* ⚡ Prevent duplicate requests (very important) */
  if (inFlight) {
    return inFlight;
  }

  inFlight = (async () => {
    try {
      const q = query(collection(db, "products"), limit(60));
      const snap = await getDocs(q);

      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      cache = data;
      lastFetch = Date.now();

      return data;
    } catch (err) {
      console.error("Firestore error:", err);

      /* fallback */
      return cache || [];
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
