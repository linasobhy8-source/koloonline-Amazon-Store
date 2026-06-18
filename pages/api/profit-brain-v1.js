import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  getCountFromServer,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

/* ================= CONFIG ================= */
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

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

/* ================= SLUG SAFE ================= */
function generateSlug(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ================= BLOG ================= */
function generateBlog(product) {
  const slug = generateSlug(product.title);

  return {
    slug,
    title: `${product.title} Review 2026`,
    excerpt: `Review and buying guide for ${product.title}`,
    seoTitle: `${product.title} Best Review 2026`,
    seoDescription: `Full analysis of ${product.title}`,
    content: `<h1>${product.title}</h1><p>Auto-generated review content.</p>`,
    tags: [product.category, "review", "amazon"],
    createdAt: serverTimestamp(),
  };
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const countSnap = await getCountFromServer(collection(db, "products"));
    const count = countSnap.data().count || 0;

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

    /* ================= USE SLUG AS DOC ID ================= */
    const blogRef = doc(db, "blog", blog.slug);
    await setDoc(blogRef, blog);

    const urls = [
      `${BASE_URL}/product/${productRef.id}`,
      `${BASE_URL}/blog/${blog.slug}`,
    ];

    if (BASE_URL) {
      fetch(`${BASE_URL}/api/indexnow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: "koloonline.online",
          key: process.env.INDEXNOW_KEY,
          urlList: urls,
        }),
      }).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      productId: productRef.id,
      blogSlug: blog.slug,
      urls,
    });
  } catch (e) {
    console.error("ENGINE ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
    }
