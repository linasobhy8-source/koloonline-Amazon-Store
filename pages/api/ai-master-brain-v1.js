import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= BRAIN DECISION ENGINE ================= */
function decideSystemState(products, blogs) {
  const productCount = products.length;
  const blogCount = blogs.length;

  if (productCount < 10) return "BOOST_PRODUCTS";
  if (blogCount < 5) return "BOOST_CONTENT";
  if (productCount > 50 && blogCount > 20) return "OPTIMIZE_REVENUE";

  return "STABLE";
}

export default async function handler(req, res) {
  try {
    const productSnap = await getDocs(collection(db, "products"));
    const blogSnap = await getDocs(collection(db, "blog"));

    const products = productSnap.docs.map((d) => d.data());
    const blogs = blogSnap.docs.map((d) => d.data());

    const state = decideSystemState(products, blogs);

    let actions = [];

    if (state === "BOOST_PRODUCTS") {
      actions.push("Run ai-product-filter-v1");
      actions.push("Run ai-profit-predictor-v1");
    }

    if (state === "BOOST_CONTENT") {
      actions.push("Run auto-blog-generator-v2");
    }

    if (state === "OPTIMIZE_REVENUE") {
      actions.push("Run ai-learning-loop-v1");
    }

    return res.status(200).json({
      success: true,
      state,
      products: products.length,
      blogs: blogs.length,
      actions,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
