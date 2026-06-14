import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

const db = getFirestore(app);

export default async function handler(req, res) {
  const snap = await getDocs(collection(db, "products"));

  const viral = [];

  snap.forEach((d) => {
    const data = d.data();

    if ((data.viralScore || 0) >= 70) {
      viral.push({
        id: d.id,
        ...data,
      });
    }
  });

  viral.sort((a, b) => b.viralScore - a.viralScore);

  res.status(200).json(viral.slice(0, 20));
}
