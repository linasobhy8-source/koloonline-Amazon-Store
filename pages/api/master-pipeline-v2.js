import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  getCountFromServer,
  serverTimestamp,
} from "firebase/firestore";

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
  return PRODUCT_POOL[
    Math.floor(Math.random() * PRODUCT_POOL.length)
  ];
}

function generateSlug(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/* ================= SEO BLOG GENERATOR (IMPROVED) ================= */
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

<p>
This is one of the trending products in ${product.category} category.
We analyze performance, price and real value.
</p>

<h3>Key Features</h3>
<ul>
<li>High quality build</li>
<li>Affordable price</li>
<li>Good user ratings</li>
</ul>

<h3>Why People Buy It</h3>
<p>
Because it offers strong value compared to competitors.
</p>

<h3>Final Verdict</h3>
<p>
Recommended for budget buyers looking for reliable performance.
</p>
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
      error: e.message,
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

  const res = await safeFetch(
    "https://api.indexnow.org/indexnow",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  return {
    ...res,
    submittedUrls: urls.length,
  };
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const started = Date.now();

  try {
    /* ===== SECURITY ===== */
    if (
      process.env.CRON_SECRET &&
      req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    /* ===== LIMIT CONTROL (ANTI-SPAM) ===== */
    const countSnap = await getCountFromServer(
      collection(db, "products")
    );

    const existingProducts = countSnap.data().count;

    if (existingProducts > 5000) {
      return res.status(200).json({
        success: false,
        reason: "limit_reached",
      });
    }

    /* ===== GENERATE PRODUCT ===== */
    const product = randomProduct();

    const productRef = await addDoc(
      collection(db, "products"),
      {
        ...product,
        views: 0,
        clicks: 0,
        rating: 4.5,
        trendingScore: product.viralBoost ? 80 : 40,
        createdAt: serverTimestamp(),
      }
    );

    /* ===== GENERATE BLOG ===== */
    const blog = generateBlog(product);

    const blogRef = await addDoc(
      collection(db, "blog"),
      {
        ...blog,
        createdAt: serverTimestamp(),
      }
    );

    /* ===== URLS ===== */
    const urls = [
      `${BASE_URL}/product/${productRef.id}`,
      `${BASE_URL}/blog/${blogRef.id}`,
    ];

    /* ===== INDEXING ===== */
    const [indexNow] = await Promise.all([
      submitIndexNow(urls),
    ]);

    return res.status(200).json({
      success: true,
      runtime: Date.now() - started,

      existingProducts,
      productId: productRef.id,
      blogId: blogRef.id,

      seoBoost: true,
      trendingInjected: true,

      urlsIndexed: urls.length,
      indexNow,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Error",
    });
  }
    }
