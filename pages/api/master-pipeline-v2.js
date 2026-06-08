import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= SAFE RUN ================= */
async function safeRun(label, fn) {
  try {
    const result = await fn();
    return { success: true, label, result };
  } catch (e) {
    return { success: false, label, error: e?.message || "error" };
  }
}

/* ================= PRODUCT ENGINE ================= */
function generateProduct() {
  const products = [
    {
      title: "Smart Watch Ultra AI",
      price: 39.99,
      category: "electronics",
      image:
        "https://m.media-amazon.com/images/I/71gJb7R6Q7L._AC_SL1500_.jpg",
      viralBoost: true,
    },
    {
      title: "Wireless Earbuds Pro",
      price: 24.99,
      category: "audio",
      image:
        "https://m.media-amazon.com/images/I/61f1xD6g0LL._AC_SL1500_.jpg",
      viralBoost: true,
    },
    {
      title: "Mini LED Projector HD",
      price: 59.99,
      category: "home",
      image:
        "https://m.media-amazon.com/images/I/71Rr0Y2K3LL._AC_SL1500_.jpg",
      viralBoost: false,
    },
  ];

  return products[Math.floor(Math.random() * products.length)];
}

/* ================= BLOG ENGINE ================= */
function generateBlog(product) {
  const slug = (product.title || "product")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return {
    title: `Review: ${product.title} – Is It Worth It?`,
    excerpt: `Review of ${product.title} with pros, cons and analysis.`,
    content: `
      <h2>Overview</h2>
      <p>${product.title} is trending in ${product.category}.</p>

      <h2>Features</h2>
      <ul>
        <li>Good quality</li>
        <li>Price: $${product.price}</li>
        <li>Trending product</li>
      </ul>

      <h2>Verdict</h2>
      <p>Recommended for value buyers.</p>
    `,
    slug,
  };
}

/* ================= INDEXNOW ================= */
async function runIndexNow(urls = []) {
  const key = process.env.INDEXNOW_KEY;

  if (!key) return { success: false, error: "Missing INDEXNOW_KEY" };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "koloonline.online",
        key,
        urlList: urls.slice(0, 50),
      }),
    });

    return { success: res.ok };
  } catch (e) {
    return { success: false, error: e?.message };
  }
}

/* ================= GOOGLE PING ================= */
async function pingGoogle() {
  try {
    const url = "https://koloonline.online/sitemap.xml";

    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`
    );

    return { success: true };
  } catch (e) {
    return { success: false, error: e?.message };
  }
}

/* ================= MAIN PIPELINE ================= */
export default async function handler(req, res) {
  const startTime = Date.now();

  try {
    const baseUrl = "https://koloonline.online";

    const logs = [];
    const newUrls = [];

    /* ================= COUNT PRODUCTS ================= */
    const productsSnap = await getDocs(collection(db, "products"));
    const existingCount = productsSnap?.size || 0;

    /* ================= CREATE PRODUCT ================= */
    const product = generateProduct();

    const productRef = await addDoc(collection(db, "products"), {
      ...product,
      views: 0,
      clicks: 0,
      rating: 4.5,
      createdAt: serverTimestamp(),
    });

    newUrls.push(`${baseUrl}/product/${productRef.id}`);

    logs.push({ step: "product_created" });

    /* ================= CREATE BLOG ================= */
    const blog = generateBlog(product);

    const blogRef = await addDoc(collection(db, "blog"), {
      ...blog,
      createdAt: serverTimestamp(),
    });

    newUrls.push(`${baseUrl}/blog/${blogRef.id}`);

    logs.push({ step: "blog_created" });

    /* ================= URLS ================= */
    const urls = [
      baseUrl,
      `${baseUrl}/products`,
      `${baseUrl}/blog`,
      ...newUrls,
    ];

    /* ================= INDEX + PING ================= */
    const indexResult = await safeRun("IndexNow", () =>
      runIndexNow(urls)
    );

    const pingResult = await safeRun("GooglePing", pingGoogle);

    logs.push(indexResult, pingResult);

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      runtime: Date.now() - startTime,
      message: "🔥 Master Pipeline V2 Running Stable",
      existingProducts: existingCount,
      urlsGenerated: urls.length,
      logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Unknown error",
    });
  }
}
