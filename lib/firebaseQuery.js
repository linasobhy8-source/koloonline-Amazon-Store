import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { normalizeProduct } from "./safeProduct";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= SAFE FETCH ================= */
export async function getProductsFast() {
  const snap = await getDocs(collection(db, "products"));

  if (!snap?.docs) return [];

  return snap.docs
    .map((doc) => normalizeProduct(doc.data ? doc.data() : doc))
    .filter(Boolean);
}
