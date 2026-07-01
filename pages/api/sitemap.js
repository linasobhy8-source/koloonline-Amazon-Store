import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { aiDecision } from "../../lib/aiEngine";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://koloonline.online";

/* ================= Helpers ================= */

function safeDate(value) {
  try {
    if (!value) return new Date().toISOString();
    if (typeof value?.toDate === "function") return value.toDate().toISOString();
    return new Date(value).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* ================= Firestore Fetch ================= */

async function getProducts() {
  try {
    const snapshot = await getDocs(collection(db, "products"));

    const products = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      products.push({
        id: doc.id,
        slug: data.slug || doc.id,
        updatedAt: data.updatedAt || null,
        title: data.title || "",
        status: data.status || "active",
        visibility: data.visibility || "public",
      });
    });

    return products;
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return [];
  }
}

/* ================= AI Filtering Layer ================= */

async function filterProductsWithAI(products) {
  try {
    if (!products.length) return [];

    // AI decides which products should be in sitemap
    const result = await aiDecision({
      type: "sitemap_filter",
      products,
    });

    // Expected format:
    // result = { allowedIds: [] } OR directly array OR filtered products
    if (!result) return products;

    if (Array.isArray(result)) return result;

    if (result.allowedIds) {
      return products.filter((p) => result.allowedIds.includes(p.id));
    }

    if (result.filteredProducts) {
      return result.filteredProducts;
    }

    return products;
  } catch (error) {
    console.error("AI decision error:", error);
    return products;
  }
}

/* ================= URL Builder ================= */

function buildProductUrls(products) {
  return products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastmod: safeDate(p.updatedAt),
    changefreq: "daily",
    priority: 0.9,
