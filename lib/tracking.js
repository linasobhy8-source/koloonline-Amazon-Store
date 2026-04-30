import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  setDoc,
  getDoc
} from "firebase/firestore";

import { db } from "../config/firebase";

/* ================= COUNTRY DETECTION ================= */
export function getCountry() {
  if (typeof window === "undefined") return "US";

  const lang = navigator.language || "en-US";

  if (lang.includes("ar")) return "EG";
  if (lang.includes("pl")) return "PL";
  if (lang.includes("en-CA")) return "CA";

  return "US";
}

/* ================= SAFE URL ================= */
function getSafeUrl() {
  if (typeof window === "undefined") return "";
  return window.location.href;
}

/* ================= MAIN TRACK ================= */
export async function trackEvent(type, data = {}) {
  try {
    const eventData = {
      type,
      asin: data.asin || null,
      title: data.title || "",
      price: data.price || null,
      category: data.category || "unknown",
      country: getCountry(),
      timestamp: serverTimestamp(),
      url: getSafeUrl()
    };

    /* ================= 1. RAW EVENTS ================= */
    addDoc(collection(db, "events"), eventData).catch(() => {});

    /* ================= 2. GLOBAL ANALYTICS ================= */
    const overviewRef = doc(db, "analytics", "overview");

    const overviewSnap = await getDoc(overviewRef);

    if (!overviewSnap.exists()) {
      await setDoc(overviewRef, {
        totalClicks: 0,
        totalOrders: 0,
        totalWhatsApp: 0
      });
    }

    if (type === "click") {
      await updateDoc(overviewRef, {
        totalClicks: increment(1)
      });
    }

    if (type === "order") {
      await updateDoc(overviewRef, {
        totalOrders: increment(1)
      });
    }

    if (type === "whatsapp") {
      await updateDoc(overviewRef, {
        totalWhatsApp: increment(1)
      });
    }

    /* ================= 3. PRODUCT ANALYTICS ================= */
    if (data.asin) {
      const analyticsRef = doc(db, "analytics_products", data.asin);

      const snap = await getDoc(analyticsRef);

      if (!snap.exists()) {
        await setDoc(analyticsRef, {
          asin: data.asin,
          clicks: 0,
          orders: 0,
          whatsapp: 0,
          category: data.category || "unknown"
        });
      }

      await updateDoc(analyticsRef, {
        ...(type === "click" && { clicks: increment(1) }),
        ...(type === "order" && { orders: increment(1) }),
        ...(type === "whatsapp" && { whatsapp: increment(1) })
      });

      /* ================= 4. SMART SCORE (FIXED AI LOGIC) ================= */
      const productRef = doc(db, "products", data.asin);

      const weight =
        type === "click" ? 0.3 :
        type === "order" ? 1.2 :
        type === "whatsapp" ? 0.6 : 0;

      // 🔥 مهم: score بيزيد تدريجي مش explode
      await updateDoc(productRef, {
        clicks: type === "click" ? increment(1) : increment(0),
        orders: type === "order" ? increment(1) : increment(0),
        whatsapp: type === "whatsapp" ? increment(1) : increment(0),

        // 🧠 AI Score (bounded growth)
        score: increment(weight)
      }).catch(async () => {
        await setDoc(productRef, {
          asin: data.asin,
          clicks: type === "click" ? 1 : 0,
          orders: type === "order" ? 1 : 0,
          whatsapp: type === "whatsapp" ? 1 : 0,

          score: weight
        });
      });
    }

    /* ================= DEBUG ================= */
    if (process.env.NODE_ENV === "development") {
      console.log("🔥 AI Tracked:", eventData);
    }

  } catch (err) {
    console.error("❌ Tracking Error:", err);
  }
}
