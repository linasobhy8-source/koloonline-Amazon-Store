import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= PRODUCT VALUE MODEL ================= */
function productValue(p) {
  const price = p.price || 0;
  const score = p.score || 0;
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;

  let value =
    score * 2 +
    clicks * 1.5 +
    orders * 10 +
    price * 0.1;

  if (price > 50) value += 20;
  if (price > 100) value += 40;
  if (p.viralBoost) value += 30;

  return value;
}

/* ================= CONTENT VALUE ================= */
function contentValue(p) {
  const views = p.views || 0;
  const ctr = views > 0 ? (p.clicks || 0) / views : 0;

  return views * ctr;
}

/* ================= MAIN ================= */
export default async function handler(req, res) {
  try {

    const blogSnap = await getDocs(collection(db, "blog"));
    const productSnap = await getDocs(collection(db, "products"));

    const blogs = blogSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    const products = productSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= 1. FIND HIGH VALUE PRODUCTS ================= */

    const topProducts = products
      .map(p => ({
        ...p,
        value: productValue(p),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);

    /* ================= 2. FIND HIGH VALUE BLOGS ================= */

    const topBlogs = blogs
      .map(p => ({
        ...p,
        value: contentValue(p),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);

    /* ================= 3. AUTO INJECT PRODUCTS INTO BLOGS ================= */

    const updates = [];

    for (const blog of topBlogs) {
      try {
        const injectedProducts = topProducts
          .slice(0, 3)
          .map(p => ({
            id: p.id,
            title: p.title,
            price: p.price,
            image: p.image,
          }));

        await updateDoc(doc(db, "blog", blog.id), {
          monetizationBoost: true,
          injectedProducts,
          revenueOptimized: true,
          updatedAt: serverTimestamp(),
        });

        updates.push({
          blogId: blog.id,
          injected: injectedProducts.length,
        });

      } catch (e) {
        updates.push({
          blogId: blog.id,
          error: e.message,
        });
      }
    }

    /* ================= 4. BOOST HIGH VALUE PRODUCTS ================= */

    for (const product of topProducts.slice(0, 10)) {
      try {
        await updateDoc(doc(db, "products", product.id), {
          revenuePriority: "HIGH",
          monetizedBoost: true,
          updatedAt: serverTimestamp(),
        });
      } catch {}
    }

    /* ================= 5. TRIGGER SEO SYSTEM ================= */

    await fetch("https://koloonline.online/api/seo/traffic-os", {
      method: "POST",
    }).catch(() => {});

    /* ================= RESULT ================= */

    return res.status(200).json({
      success: true,
      topProducts: topProducts.slice(0, 10).map(p => ({
        id: p.id,
        value: p.value,
      })),
      topBlogs: topBlogs.slice(0, 10).map(p => ({
        id: p.id,
        value: p.value,
      })),
      updates,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
