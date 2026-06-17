import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const SERPAPI_KEY = process.env.SERPAPI_KEY;

/* ================= KEYWORDS ================= */

const keywords = [
  "smart watch",
  "wireless earbuds",
  "gaming headset",
  "iphone accessories",
  "gaming mouse",
  "portable speaker",
  "rgb keyboard",
  "laptop stand",
];

/* ================= CLEAN HELPERS ================= */

function cleanText(v) {
  if (!v) return "";

  if (typeof v === "string") return v;

  if (typeof v === "number") return String(v);

  if (typeof v === "object") {
    return v.text || v.title || v.name || "";
  }

  return "";
}

function cleanImage(v) {
  if (typeof v === "string" && v.startsWith("http")) return v;

  if (typeof v === "object") {
    return v.url || v.image || v.src || v.thumbnail || "";
  }

  return "";
}

function cleanNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/* ================= FETCH AMAZON ================= */

async function fetchAmazonProducts(keyword) {
  try {
    const res = await fetch(
      `https://serpapi.com/search.json?engine=amazon&q=${encodeURIComponent(
        keyword
      )}&api_key=${SERPAPI_KEY}`
    );

    const data = await res.json();

    return data?.organic_results || [];
  } catch (err) {
    console.error(`❌ Fetch Error (${keyword}):`, err);
    return [];
  }
}

/* ================= CATEGORY ================= */

function detectCategory(keyword) {
  const k = keyword.toLowerCase();

  if (k.includes("watch")) return "smartwatch";
  if (
    k.includes("earbuds") ||
    k.includes("headset") ||
    k.includes("speaker")
  )
    return "audio";

  if (k.includes("keyboard") || k.includes("mouse"))
    return "gaming";

  if (k.includes("iphone")) return "mobile";
  if (k.includes("laptop")) return "computer";

  return "electronics";
}

/* ================= SYNC ================= */

async function syncToFirestore() {
  try {
    console.log("🚀 Amazon Sync Started...");

    for (const keyword of keywords) {
      console.log(`🔍 Fetching: ${keyword}`);

      const products = await fetchAmazonProducts(keyword);

      for (const p of products) {
        if (!p?.asin) continue;

        try {
          const ref = doc(db, "products", p.asin);

          const existing = await getDoc(ref);
          const oldData = existing.exists() ? existing.data() : {};

          const newData = {
            asin: p.asin,

            title: cleanText(p.title || "No Title").trim(),

            image: cleanImage(p.thumbnail),

            price: cleanNumber(p.price),

            link: typeof p.link === "string" ? p.link : "",

            category: detectCategory(keyword),

            rating: cleanNumber(p.rating, 4.5),

            views: oldData.views || 0,
            clicks: oldData.clicks || 0,
            orders: oldData.orders || 0,
            whatsapp: oldData.whatsapp || 0,

            score: oldData.score || 0,
            viralBoost: Boolean(oldData.viralBoost),

            keyword,

            updatedAt: Date.now(),
          };

          await setDoc(ref, newData, { merge: true });

          console.log(`✅ Saved: ${p.asin}`);
        } catch (err) {
          console.error(`❌ Product Error (${p?.asin})`, err);
        }
      }
    }

    console.log("🔥 Auto Sync Completed Successfully");
  } catch (err) {
    console.error("❌ Sync Error:", err);
  }
}

/* ================= RUN ================= */

syncToFirestore();
