import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { normalizeProduct } from "./normalizeProduct";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const db = getFirestore(app);

export async function getProductsFast() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = [];

    snap.forEach((doc) => {
      const data = doc.data();

      products.push(
        normalizeProduct({
          id: doc.id,
          ...data,
        })
      );
    });

    return products;
  } catch (e) {
    console.error("Firebase Query Error:", e);
    return [];
  }
}
