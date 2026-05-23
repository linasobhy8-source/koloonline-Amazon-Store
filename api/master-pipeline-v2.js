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
    return { success: false, label, error: e.message };
  }
}

/* ================= AUTO PRODUCTS GENERATOR ================= */
function generateProduct() {
  const products = [
    {
      title: "Smart Watch Ultra AI",
      price: 39.99,
      category: "electronics",
      image: "https://m.media-amazon.com/images/I/71gJb7R6Q7L._AC_SL1500_.jpg",
      viralBoost: true,
    },
    {
      title: "Wireless Earbuds Pro",
      price: 24.99,
      category: "audio",
      image: "https://m.media-amazon.com/images/I/61f1xD6g0LL._AC_SL1500_.jpg",
      viralBoost: true,
    },
    {
      title: "Mini LED Projector HD",
      price: 59.99,
      category: "home",
      image: "https://m.media-amazon.com/images/I/71Rr0Y2K3LL._AC_SL1500_.jpg",
      viralBoost: false,
    },
  ];

  return products[Math.floor(Math.random() * products.length)];
}

/* ================= AUTO BLOG GENERATOR ================= */
function generateBlog(product) {
  return {
    title: `Why ${product.title} is Trending in 2026`,
    content: `
      The ${product.title} is one of the hottest products right now.
      It offers great value in the ${product.category} category.
      Price: $${product.price} makes it affordable for most users.
      This product is currently trending due to high engagement.
    `,
    slug: product.title.toLowerCase().replace(/\s+/g, "-"),
  };
}

/* ================= INDEXNOW ================= */
async function runIndexNow(urls) {
  const key = process.env.INDEXNOW_KEY;

  await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: "koloonline.online",
      key,
      urlList: urls.slice(0, 50),
    }),
  });

  return { sent: urls.length };
}

/* ================= GOOGLE PING ================= */
async function pingGoogle() {
  const url = "https://koloonline.online/sitemap.xml";

  await fetch(
    `https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`
  );

  return { pinged: true };
}

/* ================= MAIN PIPELINE ================= */
export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";

    const logs = [];
    const newUrls = [];

    /* ================= FETCH EXISTING ================= */
    const productsSnap = await getDocs(collection(db, "products"));

    const existingCount = productsSnap.size;

    /* ================= AUTO CREATE PRODUCTS ================= */
    const product = generateProduct();

    const productRef = await addDoc(collection(db, "products"), {
      ...product,
      views: 0,
      clicks: 0,
      rating: 4.5,
      createdAt: serverTimestamp(),
    });

    newUrls.push(`${baseUrl}/product/${productRef.id}`);

    logs.push({ step: "product_created", product });

    /* ================= AUTO BLOG ================= */
    const blog = generateBlog(product);

    const blogRef = await addDoc(collection(db, "blog"), {
      ...blog,
      createdAt: serverTimestamp(),
    });

    newUrls.push(`${baseUrl}/blog/${blogRef.id}`);

    logs.push({ step: "blog_created", blog });

    /* ================= ALL URLS ================= */
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
      error: error.message,
    });
  }
}
