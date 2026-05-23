import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= LIGHT PRODUCT GENERATOR ================= */
function generateProduct(keyword) {
  return {
    title: `${keyword} - Amazon Deal`,
    image: "https://m.media-amazon.com/images/I/71gJb7R6Q7L._AC_SL1500_.jpg",
    price: +(Math.random() * 90 + 10).toFixed(2),
    category: "auto",
    views: 0,
    clicks: 0,
    orders: 0,
    rating: 4.2 + Math.random(),
    viralBoost: Math.random() > 0.7,
    source: "auto_generator_v2",
    createdAt: serverTimestamp(),
  };
}

/* ================= KEYWORDS ================= */
const keywords = [
  "smart watch pro",
  "wireless earbuds",
  "usb c charger",
  "gaming mouse",
  "fitness tracker",
  "mini projector",
  "phone stand",
  "power bank fast charge",
];

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const created = [];

    // ⚡ limit batch for speed
    const batch = 3;

    for (let i = 0; i < batch; i++) {
      const keyword = keywords[Math.floor(Math.random() * keywords.length)];
      const product = generateProduct(keyword);

      const ref = await addDoc(collection(db, "products"), product);

      created.push({
        id: ref.id,
        title: product.title,
      });
    }

    return res.status(200).json({
      success: true,
      createdCount: created.length,
      created,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
