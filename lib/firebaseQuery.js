import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= SAFE NORMALIZER ================= */
const normalize = (doc) => {
  const data = doc.data ? doc.data() : doc;

  return {
    id: typeof doc.id === "string" ? doc.id : String(data?.id || ""),
    title:
      typeof data?.title === "string"
        ? data.title
        : typeof data?.title === "object"
        ? data?.title?.text || data?.title?.name || ""
        : "",
    image:
      typeof data?.image === "string"
        ? data.image
        : "",
    price: Number(data?.price || 0),
  };
};

/* ================= MAIN EXPORT ================= */
export async function getProductsFast() {
  const snap = await getDocs(collection(db, "products"));

  if (!snap || !Array.isArray(snap.docs)) {
    return [];
  }

  return snap.docs
    .filter(Boolean)
    .map(normalize)
    .filter((p) => p.id); // يمنع React crash نهائي
}
