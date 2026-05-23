import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import indexNow from "./indexnow";
import pingGoogle from "./ping-google";

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

/* ================= SAFE EXECUTION WRAPPER ================= */
async function safeRun(label, fn, retries = 2) {
  let lastError = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const result = await fn();
      return { success: true, label, result, attempts: i + 1 };
    } catch (err) {
      lastError = err;

      console.error(`❌ ${label} failed attempt ${i + 1}`, err.message);

      if (i === retries) {
        return {
          success: false,
          label,
          error: err.message,
          attempts: i + 1,
        };
      }
    }
  }

  return {
    success: false,
    label,
    error: lastError?.message || "Unknown error",
  };
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";

    const logs = [];

    /* ================= 1. FETCH DATA ================= */
    const productsSnap = await getDocs(collection(db, "products"));
    const blogSnap = await getDocs(collection(db, "blog"));

    const products = productsSnap.docs.map((d) => d.id);
    const blogs = blogSnap.docs.map((d) => d.id);

    const urls = [
      `${baseUrl}`,
      `${baseUrl}/blog`,
      `${baseUrl}/products`,
      `${baseUrl}/search`,
      `${baseUrl}/categories`,
      ...products.map((id) => `${baseUrl}/product/${id}`),
      ...blogs.map((id) => `${baseUrl}/blog/${id}`),
    ];

    /* ================= 2. INDEXNOW (SELF HEALING) ================= */
    const indexNowResult = await safeRun("IndexNow", async () => {
      return await indexNow(req, res);
    });

    logs.push(indexNowResult);

    /* ================= 3. GOOGLE PING (SELF HEALING) ================= */
    const googleResult = await safeRun("GooglePing", async () => {
      return await pingGoogle(req, res);
    });

    logs.push(googleResult);

    /* ================= 4. VALIDATION CHECK ================= */
    const missingUrls = urls.filter((u) => !u || u.includes("undefined"));

    if (missingUrls.length > 0) {
      logs.push({
        warning: "Missing URLs detected",
        count: missingUrls.length,
      });
    }

    /* ================= 5. AUTO RECOVERY ================= */
    if (!indexNowResult.success) {
      logs.push({
        recovery: "Retrying IndexNow once more...",
      });

      await safeRun("IndexNow-Recovery", async () => {
        return await indexNow(req, res);
      });
    }

    if (!googleResult.success) {
      logs.push({
        recovery: "Retrying Google Ping...",
      });

      await safeRun("GooglePing-Recovery", async () => {
        return await pingGoogle(req, res);
      });
    }

    /* ================= 6. FINAL RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Self-Healing Master Pipeline executed",
      totalUrls: urls.length,
      logs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
