import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= GLOBAL CACHE ================= */
let cache = null;
let lastFetch = 0;

const CACHE_TIME = 1000 * 60 * 30; // 30 min (أطول = أسرع)

export async function getProductsFast() {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_TIME) {
    return cache;
  }

  const q = query(collection(db, "products"), limit(80));
  const snap = await getDocs(q);

  const data = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  cache = data;
  lastFetch = now;

  return data;
}
