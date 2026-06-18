import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

/* ================= SAFE FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const db = getFirestore(app);

/* ================= API HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const viral = [];

    snap.forEach((d) => {
      const data = d.data() || {};

      const viralScore = Number(data.viralScore) || 0;

      if (viralScore >= 70) {
        viral.push({
          id: d.id,
          ...data,
          viralScore,
        });
      }
    });

    viral.sort((a, b) => (b.viralScore || 0) - (a.viralScore || 0));

    return res.status(200).json(viral.slice(0, 20));
  } catch (error) {
    console.error("viral api error:", error);
    return res.status(500).json([]);
  }
}
