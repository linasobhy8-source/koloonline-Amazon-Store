import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/* ================= DEFAULT POLICY ================= */

const DEFAULT_POLICY = {
  weights: {
    views: 0.2,
    clicks: 0.3,
    orders: 0.4,
    conversion: 0.1,
  },
  updatedAt: Date.now(),
};

/* ================= GET POLICY ================= */
export async function getAdaptivePolicy() {
  const snap = await getDoc(doc(db, "ai", "policy"));

  if (!snap.exists()) {
    await setDoc(doc(db, "ai", "policy"), DEFAULT_POLICY);
    return DEFAULT_POLICY;
  }

  return snap.data();
}

/* ================= UPDATE POLICY ================= */
export async function updateAdaptivePolicy(policy) {
  await setDoc(doc(db, "ai", "policy"), policy);
}
