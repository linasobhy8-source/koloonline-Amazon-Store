import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= FAST LOAD ================= */
export async function getProductsFast() {
  const q = query(collection(db, "products"), limit(60));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}
