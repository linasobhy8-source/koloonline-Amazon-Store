import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { viralScore } from "../../../lib/viralScore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const updates = [];

    snap.forEach((d) => {
      const data = d.data();

      const score = viralScore(data);

      let label = "normal";
      if (score > 80) label = "viral";
      else if (score > 60) label = "rising";
      else if (score < 30) label = "dead";

      updates.push(
        updateDoc(doc(db, "products", d.id), {
          viralScore: score,
          viralLabel: label,
        })
      );
    });

    await Promise.all(updates);

    res.status(200).json({
      success: true,
      updated: updates.length,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
        }
