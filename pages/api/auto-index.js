import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const key = process.env.INDEXNOW_KEY;

    const { type, id } = req.body; 
    // type: "blog" | "product"

    if (!type || !id) {
      return res.status(400).json({ error: "missing data" });
    }

    const url =
      type === "blog"
        ? `https://koloonline.online/blog/${id}`
        : `https://koloonline.online/product/${id}`;

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "koloonline.online",
        key,
        urlList: [url],
      }),
    });

    const result = await response.text();

    return res.status(200).json({
      success: true,
      url,
      result,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
