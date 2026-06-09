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

function generateBlog(product) {
  const slug = generateSlug(product.title);

  return {
    title: `${product.title} Review`,
    slug,
    excerpt: `${product.title} review and buying guide.`,
    content: `
<h2>${product.title}</h2>

<p>
Discover features, benefits and value for money.
</p>

<ul>
<li>Affordable pricing</li>
<li>Good user experience</li>
<li>Popular category</li>
</ul>

<p>
Suitable for everyday use.
</p>
`,
  };
}

/* ================= SAFE FETCH ================= */
async function safeFetch(url, options = {}) {
  try {
    const controller = new AbortController();

    const timer = setTimeout(
      () => controller.abort(),
      10000
    );

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
  if (!process.env.INDEXNOW_KEY) {
    return { skipped: true };
  }

  return safeFetch(
    "https://api.indexnow.org/indexnow",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: "koloonline.online",
        key: process.env.INDEXNOW_KEY,
        urlList: urls.slice(0, 50),
      }),
    }
  );
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const started = Date.now();

  try {
    /* ===== Optional Security ===== */
    if (
      process.env.CRON_SECRET &&
      req.headers.authorization !==
        `Bearer ${process.env.CRON_SECRET}`
    ) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    /* ===== Count Only (FAST) ===== */
    const countSnap = await getCountFromServer(
      collection(db, "products")
    );

    const existingProducts = countSnap.data().count;

    /* ===== Create Product ===== */
    const product = randomProduct();

    const productRef = await addDoc(
      collection(db, "products"),
      {
        ...product,
        views: 0,
        clicks: 0,
        rating: 4.5,
        createdAt: serverTimestamp(),
      }
    );

    /* ===== Create Blog ===== */
    const blog = generateBlog(product);

    const blogRef = await addDoc(
      collection(db, "blog"),
      {
        ...blog,
        createdAt: serverTimestamp(),
      }
    );

    const urls = [
      `${BASE_URL}/product/${productRef.id}`,
      `${BASE_URL}/blog/${blogRef.id}`,
    ];

    /* ===== Run In Parallel ===== */
    const [indexNow] = await Promise.all([
      submitIndexNow(urls),
    ]);

    return res.status(200).json({
      success: true,
      runtime: Date.now() - started,

      existingProducts,

      productId: productRef.id,
      blogId: blogRef.id,

      urlsIndexed: urls.length,

      indexNow,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Error",
    });
  }
      }
