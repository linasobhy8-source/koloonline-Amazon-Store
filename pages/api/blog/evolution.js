import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const app = !getApps().length ? initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
}) : getApps()[0];

const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "blog"));

    const posts = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    const improved = posts.map(p => {
      let score = 0;

      if (p.auto) score += 20;
      if ((p.views || 0) > 100) score += 30;
      if ((p.clicks || 0) > 20) score += 20;

      return {
        id: p.id,
        evolveScore: score,
        shouldRewrite: score < 40
      };
    });

    return res.status(200).json({
      success: true,
      evolution: improved
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
