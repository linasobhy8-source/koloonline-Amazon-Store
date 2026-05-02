import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

/* ================= CLEAN HELPERS ================= */
function cleanTitle(title) {
  return title
    ?.replace(/\s+/g, " ")
    ?.replace(/Amazon\.com:?/gi, "")
    ?.replace(/\|.*$/g, "")
    ?.trim();
}

function cleanPrice(price) {
  if (!price) return 0;

  const num = parseFloat(String(price).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

function getImage(item) {
  return (
    item?.thumbnail ||
    item?.image ||
    item?.original_image ||
    "/placeholder.png"
  );
}

/* ================= CRON LOGGER ================= */
async function logCron({ job, status, updated = 0, skipped = 0, message = "" }) {
  try {
    await addDoc(collection(db, "cron_logs"), {
      job,
      status,
      updated,
      skipped,
      message,
      time: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("Cron log failed:", e.message);
  }
}

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  const keyword = req.query.q || "amazon deals";

  try {
    const apiKey = process.env.SERPAPI_KEY;

    if (!apiKey) {
      throw new Error("Missing SERPAPI_KEY");
    }

    const url = `https://serpapi.com/search.json?engine=amazon&q=${encodeURIComponent(
      keyword
    )}&api_key=${apiKey}`;

    const response = await fetch(url);

    /* ================= FETCH CHECK ================= */
    if (!response.ok) {
      throw new Error(`SerpAPI error: ${response.status}`);
    }

    const data = await response.json();

    /* ================= LIMIT RESULTS ================= */
    const results = (
      data?.organic_results ||
      data?.shopping_results ||
      []
    ).slice(0, 20);

    let saved = 0;
    let skipped = 0;

    /* ================= EXISTING PRODUCTS ================= */
    const existingSnap = await getDocs(collection(db, "products"));

    const existingLinks = new Set(
      existingSnap.docs.map((d) => d.data().link)
    );

    /* ================= PROCESS ================= */
    for (const item of results) {
      try {
        if (!item?.title || !item?.link) {
          skipped++;
          continue;
        }

        const title = cleanTitle(item.title);
        const price = cleanPrice(item.price || item.extracted_price);
        const image = getImage(item);

        if (!title || price <= 0 || !image) {
          skipped++;
          continue;
        }

        if (existingLinks.has(item.link)) {
          skipped++;
          continue;
        }

        const tag = process.env.AMAZON_US || "koloonlinesto-20";
        const affiliateLink = `${item.link}?tag=${tag}`;

        const trendBoost =
          item.bestseller || item.is_best_seller ? 5 : 0;

        const score =
          (item.rating || 3) * 2 +
          Math.min(item.reviews || 0, 1000) / 500 +
          (price < 50 ? 3 : 1) +
          trendBoost +
          Math.random();

        /* ================= SAVE PRODUCT ================= */
        const productRef = await addDoc(collection(db, "products"), {
          title,
          image,
          price,
          link: affiliateLink,
          rating: item.rating || 0,
          reviews: item.reviews || 0,
          category: keyword,
          source: "serpapi",
          createdAt: serverTimestamp(),
          clicks: 0,
          orders: 0,
          score,
        });

        /* ================= GRAPH INIT ================= */
        await setDoc(
          doc(db, "analytics/product_relations", productRef.id),
          {
            alsoViewed: [],
            boughtTogether: [],
            recommended: [],
            createdAt: serverTimestamp(),
          }
        );

        saved++;
      } catch (itemError) {
        console.error("Item error:", itemError.message);
        skipped++;
      }
    }

    /* ================= FINAL LOG ================= */
    await logCron({
      job: "sync-products",
      status: "success",
      updated: saved,
      skipped,
      message: `${keyword} sync completed`,
    });

    return res.status(200).json({
      success: true,
      message: "🔥 Sync Engine Updated + Safe AI + Logging",
      keyword,
      saved,
      skipped,
      total: results.length,
    });

  } catch (err) {
    console.error("SYNC ERROR:", err);

    await logCron({
      job: "sync-products",
      status: "error",
      message: err.message,
    });

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
      }
