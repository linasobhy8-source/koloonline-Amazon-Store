import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

const db = getFirestore(app);

function trendScore(p) {
  return (
    (p.views || 0) +
    (p.clicks || 0) * 2 +
    (p.orders || 0) * 5 +
    (p.shareCount || 0) * 10
  );
}

export default async function handler(req, res) {
  const snap = await getDocs(collection(db, "products"));

  const updates = [];

  snap.forEach((d) => {
    const data = d.data();

    const score = trendScore(data);

    let trending = false;

    if (score > 200) trending = true;

    updates.push(
      updateDoc(doc(db, "products", d.id), {
        trending,
        trendScore: score,
      })
    );
  });

  await Promise.all(updates);

  res.status(200).json({
    success: true,
    message: "Trend detection updated",
  });
}
