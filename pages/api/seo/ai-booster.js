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

function boostTitle(p) {
  if ((p.viralScore || 0) > 80) {
    return "🔥 Viral Deal: " + (p.title || "");
  }

  if ((p.trending || false)) {
    return "Trending Now: " + (p.title || "");
  }

  return p.title;
}

function boostDesc(p) {
  if ((p.viralScore || 0) > 80) {
    return "Limited-time viral product trending right now. High demand!";
  }

  if ((p.trending || false)) {
    return "Trending product with rising popularity and great reviews.";
  }

  return p.description || "";
}

export default async function handler(req, res) {
  const snap = await getDocs(collection(db, "products"));

  const updates = [];

  snap.forEach((d) => {
    const data = d.data();

    updates.push(
      updateDoc(doc(db, "products", d.id), {
        title: boostTitle(data),
        description: boostDesc(data),
      })
    );
  });

  await Promise.all(updates);

  res.status(200).json({
    success: true,
    message: "SEO boosted successfully",
  });
  }
