import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../config/firebase";

let cache = null;
let last = 0;

const TTL = 1000 * 60 * 10;

export async function getProductsFast() {
  const now = Date.now();

  if (cache && now - last < TTL) return cache;

  const q = query(collection(db, "products"), limit(80));
  const snap = await getDocs(q);

  const data = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  cache = data;
  last = now;

  return data;
}
