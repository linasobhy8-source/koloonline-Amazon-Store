import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  getCountFromServer,
  serverTimestamp,
} from "firebase/firestore";

/* ================= CONFIG ================= */
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://koloonline.online";

/* ================= PRODUCT POOL ================= */
const PRODUCT_POOL = [
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

const randomProduct = () =>
  PRODUCT_POOL[Math.floor(Math.random() * PRODUCT_POOL.length)];

function generateSlug(text = "") {
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/* ================= BLOG ENGINE ================= */
function generateBlog(product) {
  const slug = generateSlug(product.title);

  return {
    title: `${product.title} Review 2026`,
    slug,
    excerpt: `Review and buying guide for ${product.title}`,
    seoTitle: `${product.title} Best Review 2026`,
    seoDescription: `Full analysis of ${product.title} features, price and value.`,
    content: `<h1>${product.title}</h1><p>Auto-generated review content.</p>`,
    tags: [product.category, "review", "amazon"],
    createdAt: serverTimestamp(),
  };
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const countSnap = await getCountFromServer(collection(db, "products"));
    const count = countSnap.data().count;

    if (count > 5000) {
      return res.status(200).json({ success: false, reason: "limit_reached" });
    }

    const product = randomProduct();

    const productRef = await addDoc(collection(db, "products"), {
      ...product,
      views: 0,
      clicks: 0,
      rating: 4.5,
      trendingScore: product.viralBoost ? 80 : 40,
      createdAt: serverTimestamp(),
    });

    const blog = generateBlog(product);

    const blogRef = await addDoc(collection(db, "blog"), blog);

    const urls = [
      `${BASE_URL}/product/${productRef.id}`,
      `${BASE_URL}/blog/${blogRef.id}`,
    ];

    await fetch(`${BASE_URL}/api/indexnow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "koloonline.online",
        key: process.env.INDEXNOW_KEY,
        urlList: urls,
      }),
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      productId: productRef.id,
      blogId: blogRef.id,
      urls,
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
