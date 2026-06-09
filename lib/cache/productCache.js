import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

let CACHE = null;
let LAST_FETCH = 0;

const CACHE_TIME = 1000 * 60 * 10; // 10 minutes

export async function getCachedProducts() {
  const now = Date.now();

  if (CACHE && now - LAST_FETCH < CACHE_TIME) {
    return CACHE;
  }

  const snap = await getDocs(collection(db, "products"));

  CACHE = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  LAST_FETCH = now;

  return CACHE;
}
