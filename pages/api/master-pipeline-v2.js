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

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= SAFE RUN ================= */
async function safeRun(label, fn) {
  try {
    const result = await fn();
    return { success: true, label, result };
  } catch (e) {
    return { success: false, label, error: e?.message };
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

/* ================= BLOG ENGINE (SEO + ADSENSE SAFE) ================= */
function generateBlog(product) {
  return {
    title: `Review: ${product.title} – Is It Worth Buying in 2026?`,
    excerpt: `Detailed review of ${product.title}, features, pros, cons and real user opinions.`,
    content: `
      <h2>Overview</h2>
      <p>
        ${product.title} is currently one of the trending products in the ${product.category} category.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>High quality build</li>
        <li>Affordable price: $${product.price}</li>
        <li>Good user feedback and performance</li>
      </ul>

      <h2>Pros & Cons</h2>
      <p>
        This product is popular due to its balance between price and performance.
      </p>

      <h2>Final Verdict</h2>
      <p>
        If you're looking for value in this category, ${product.title} is a strong option worth considering.
      </p>
    `,
    slug: product.title.toLowerCase().replace(/\s+/g, "-"),
  };
}

/* ================= INDEXNOW ================= */
async function runIndexNow(urls) {
  const key = process.env.INDEXNOW_KEY;

  if (!key) return { success: false, error: "Missing INDEXNOW_KEY" };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: "koloonline.online",
      key,
      urlList: urls.slice(0, 50),
    }),
  });

  return { success: res.ok, sent: urls.length };
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

    /* ================= EXISTING DATA ================= */
    const productsSnap = await getDocs(collection(db, "products"));
    const existingCount = productsSnap.size;

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

    logs.push({
      step: "product_created",
      title: product.title,
    });

    /* ================= CREATE BLOG ================= */
    const blog = generateBlog(product);

    const blogRef = await addDoc(collection(db, "blog"), {
      ...blog,
      createdAt: serverTimestamp(),
    });

    newUrls.push(`${baseUrl}/blog/${blogRef.id}`);

    logs.push({
      step: "blog_created",
      title: blog.title,
    });

    /* ================= URL LIST ================= */
    const urls = [
      baseUrl,
      `${baseUrl}/products`,
      `${baseUrl}/blog`,
      ...newUrls,
    ];

    /* ================= INDEXING ================= */
    const indexResult = await safeRun("IndexNow", () =>
      runIndexNow(urls)
    );

    const pingResult = await safeRun("GooglePing", pingGoogle);

    logs.push(indexResult, pingResult);

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      runtime: Date.now() - startTime,
      message: "🔥 Master Pipeline V2 executed",
      existingProducts: existingCount,
      newProduct: product,
      newBlog: blog,
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
