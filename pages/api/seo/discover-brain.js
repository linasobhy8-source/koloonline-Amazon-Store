import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= SCORE ================= */
function score(p) {
  const views = Number(p.views || 0);
  const clicks = Number(p.clicks || 0);
  const orders = Number(p.orders || 0);

  const ctr = views ? clicks / views : 0;

  return views * 0.4 + clicks * 2 + orders * 10 + ctr * 100;
}

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "blog"));

    let posts = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    posts = posts.map(p => ({
      ...p,
      score: score(p),
    }));

    posts.sort((a, b) => b.score - a.score);

    const trending = posts.slice(0, 10);

    return res.status(200).json({
      success: true,
      trending,
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
