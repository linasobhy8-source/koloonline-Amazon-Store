import { db } from "../config/firebase";

import {
  collection,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

const SERPAPI_KEY =
  process.env.SERPAPI_KEY;

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

/* ================= FETCH AMAZON ================= */

async function fetchAmazonProducts(
  keyword
) {
  try {
    const res = await fetch(
      `https://serpapi.com/search.json?engine=amazon&q=${encodeURIComponent(
        keyword
      )}&api_key=${SERPAPI_KEY}`
    );

    const data = await res.json();

    return (
      data.organic_results || []
    );

  } catch (err) {

    console.error(
      `❌ Fetch Error (${keyword}):`,
      err
    );

    return [];
  }
}

/* ================= CATEGORY ================= */

function detectCategory(keyword) {

  const k =
    keyword.toLowerCase();

  if (
    k.includes("watch")
  )
    return "smartwatch";

  if (
    k.includes("earbuds") ||
    k.includes("headset") ||
    k.includes("speaker")
  )
    return "audio";

  if (
    k.includes("keyboard") ||
    k.includes("mouse")
  )
    return "gaming";

  if (
    k.includes("iphone")
  )
    return "mobile";

  if (
    k.includes("laptop")
  )
    return "computer";

  return "electronics";
}

/* ================= CLEAN SYNC ================= */

async function syncToFirestore() {

  try {

    console.log(
      "🚀 Amazon Sync Started..."
    );

    for (const keyword of keywords) {

      console.log(
        `🔍 Fetching: ${keyword}`
      );

      const products =
        await fetchAmazonProducts(
          keyword
        );

      for (const p of products) {

        if (!p.asin) continue;

        try {

          const ref = doc(
            db,
            "products",
            p.asin
          );

          /* ================= CHECK EXISTING ================= */

          const existing =
            await getDoc(ref);

          const oldData =
            existing.exists()
              ? existing.data()
              : {};

          const newData = {

            asin: p.asin,

            title:
              (
                p.title ||
                "No Title"
              ).trim(),

            image:
              p.thumbnail || "",

            price:
              Number(
                p.price
              ) || 0,

            link:
              p.link || "",

            category:
              detectCategory(
                keyword
              ),

            rating:
              Number(
                p.rating
              ) || 4.5,

            views:
              oldData.views || 0,

            clicks:
              oldData.clicks || 0,

            orders:
              oldData.orders || 0,

            whatsapp:
              oldData.whatsapp || 0,

            score:
              oldData.score || 0,

            viralBoost:
              oldData.viralBoost ||
              false,

            keyword,

            updatedAt:
              Date.now(),
          };

          /* ================= WRITE ================= */

          if (
            !existing.exists()
          ) {

            await setDoc(
              ref,
              newData
            );

            console.log(
              `🆕 Added: ${p.asin}`
            );

          } else {

            await setDoc(
              ref,
              newData,
              {
                merge: true,
              }
            );

            console.log(
              `♻️ Updated: ${p.asin}`
            );
          }

        } catch (err) {

          console.error(
            `❌ Product Error (${p.asin}):`,
            err
          );
        }
      }
    }

    console.log(
      "🔥 Auto Sync Completed Successfully"
    );

  } catch (err) {

    console.error(
      "❌ Sync Error:",
      err
    );
  }
}

/* ================= RUN ================= */

syncToFirestore();
