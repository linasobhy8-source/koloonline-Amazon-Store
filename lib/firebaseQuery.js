import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= HARD SAFE NORMALIZER ================= */
const normalizeText = (v) => {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return String(v);

  if (v && typeof v === "object") {
    return (
      v.title ||
      v.name ||
      v.text ||
      v.value ||
      ""
    );
  }

  return "";
};

const normalizeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const normalizeImage = (v) => {
  if (typeof v === "string" && v.startsWith("http")) return v;
  return "https://via.placeholder.com/300?text=Koloonline";
};

export async function getProductsFast() {
  const snap = await getDocs(collection(db, "products"));

  return snap.docs
    .map((doc) => {
      const data = doc.data();

      return {
        id: String(doc.id || data?.id || ""),
        title: normalizeText(data?.title),
        image: normalizeImage(data?.image),
        price: normalizeNumber(data?.price),
      };
    })
    .filter((p) => typeof p.id === "string" && p.id.length > 0);
}
