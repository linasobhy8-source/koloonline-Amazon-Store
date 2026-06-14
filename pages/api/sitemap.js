import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";

import { topPages } from "../../data/topPages";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= FAST COUNT ================= */
async function safeCount(collectionName) {
  try {
    const coll = collection(db, collectionName);
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count || 0;
  } catch (e) {
    console.error(`Error counting ${collectionName}:`, e);
    return 0;
  }
}

/* ================= XML BUILDER ================= */
function generateSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}
</urlset>`;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const baseUrl = "https://koloonline.online";

  /* =====================================================
     1️⃣ SITEMAP MODE (GET)
  ===================================================== */
  if (req.method === "GET") {
    const urls = [
      `${baseUrl}/`,
      `${baseUrl}/blog`,
      `${baseUrl}/products`,
    ];

    /* Top Pages */
    topPages.forEach((page) => {
      urls.push(`${baseUrl}/top/${page.slug}`);
    });

    /* Product Pages */
    try {
      const snapshot = await getDocs(collection(db, "products"));

      snapshot.forEach((doc) => {
        urls.push(`${baseUrl}/product/${doc.id}`);
      });

    } catch (error) {
      console.error("Sitemap Products Error:", error);
    }

    const sitemap = generateSitemap(urls);

    res.setHeader("Content-Type", "application/xml");
    return res.status(200).send(sitemap);
  }

  /* =====================================================
     2️⃣ STATS MODE (POST)
  ===================================================== */
  if (req.method === "POST") {
    try {
      const [productsCount, blogsCount] = await Promise.all([
        safeCount("products"),
        safeCount("blog"),
      ]);

      return res.status(200).json({
        success: true,
        stats: {
          productsCount,
          blogsCount,
          totalContent: productsCount + blogsCount,
        },
        urls: [
          `${baseUrl}/`,
          `${baseUrl}/blog`,
          `${baseUrl}/products`,
        ],
        timestamp: Date.now(),
      });

    } catch (e) {
      return res.status(500).json({
        success: false,
        error: e?.message || "Unknown error",
      });
    }
  }

  /* =====================================================
     3️⃣ INVALID METHOD
  ===================================================== */
  return res.status(405).json({
    success: false,
    error: "Method not allowed",
  });
}
