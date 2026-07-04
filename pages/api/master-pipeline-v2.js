import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  getCountFromServer,
  serverTimestamp,
} from "firebase/firestore";

/* ================= AI INDEX GATE ================= */
import {
  shouldIndexProduct,
  shouldSubmitToIndexNow,
  getIndexPriority,
} from "../../lib/ai-index-gate";

/* ================= CONFIG ================= */
const BASE_URL = "https://koloonline.online";

/* ================= PRODUCT POOL ================= */
const PRODUCT_POOL = [
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

/* ================= HELPERS ================= */
function randomProduct() {
  return PRODUCT_POOL[Math.floor(Math.random() * PRODUCT_POOL.length)];
}

function generateSlug(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/* ================= SEO BLOG ================= */
function generateBlog(product) {
  const slug = generateSlug(product.title);

  return {
    title: `${product.title} Review 2026 – Is It Worth It?`,
    slug,
    excerpt: `Full review of ${product.title} including features, pros, cons and Amazon value analysis.`,
    seoTitle: `${product.title} Review 2026 | Best Buying Guide`,
    seoDescription: `Detailed review of ${product.title}. Features, price, pros, cons and best alternatives.`,
    content: `
<h2>${product.title} Full Review</h2>

<p>Trending product in ${product.category} category with strong value and demand.</p>

<h3>Verdict</h3>
<p>Recommended for users looking for budget-friendly performance and viral tech value.</p>
`,
    tags: [product.category, "review", "amazon", "2026"],
    affiliateReady: true,
  };
}

/* ================= SAFE FETCH ================= */
async function safeFetch(url, options = {}) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timer);

    return {
      ok: response.ok,
      status: response.status,
    };
  } catch (e) {
    return {
      ok: false,
      error: e?.message || "Fetch Error",
    };
  }
}

/* ================= INDEXNOW ================= */
async function submitIndexNow(urls = []) {
  if (!process.env.INDEXNOW_KEY) return { skipped: true };

  const payload = {
    host: "koloonline.online",
    key: process.env.INDEXNOW_KEY,
    urlList: urls.slice(0, 50),
  };

  try {
    const res = await safeFetch(
      "https://api.indexnow.org/indexnow",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    return {
      success
