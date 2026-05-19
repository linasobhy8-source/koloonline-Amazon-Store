import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= SIMPLE SLUG ================= */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/* ================= PAGE GENERATOR ================= */
function generateContent(keyword) {
  return `
    <h1>Best ${keyword} Guide 2026</h1>
    <p>This page is automatically generated based on trending demand for ${keyword}.</p>
    <p>We analyze real user behavior, clicks, and Amazon trends to create this guide.</p>

    <h2>Why ${keyword} matters?</h2>
    <p>${keyword} is currently trending in online shopping and Amazon marketplace.</p>

    <h2>Top recommendations</h2>
    <ul>
      <li>High rated ${keyword} product</li>
      <li>Best budget ${keyword}</li>
      <li>Premium ${keyword} option</li>
    </ul>
  `;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const { keyword, type } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: "Missing keyword" });
    }

    const slug = slugify(keyword);

    const newPage = {
      title: `Best ${keyword} 2026`,
      slug,
      content: generateContent(keyword),
      excerpt: `Automatically generated guide for ${keyword}`,
      type: type || "blog",
      createdAt: new Date(),
      auto: true,
      seoScore: Math.random() * 100,
    };

    const docRef = await addDoc(collection(db, "blog"), newPage);

    return res.status(200).json({
      success: true,
      id: docRef.id,
      slug,
      url: `/blog/${slug}`,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
