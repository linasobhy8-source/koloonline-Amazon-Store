import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  setDoc
} from "firebase/firestore";

import { db } from "../config/firebase";

/* ================= COUNTRY ================= */
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

    /* ================= 1. RAW EVENT ================= */
    addDoc(collection(db, "events"), eventData).catch(() => {});

    /* ================= 2. GLOBAL ANALYTICS ================= */
    const overviewRef = doc(db, "analytics", "overview");

    updateDoc(overviewRef, {
      ...(type === "click" && { totalClicks: increment(1) }),
      ...(type === "order" && { totalOrders: increment(1) }),
      ...(type === "whatsapp" && { totalWhatsApp: increment(1) })
    }).catch(() => {
      // fallback create
      setDoc(overviewRef, {
        totalClicks: type === "click" ? 1 : 0,
        totalOrders: type === "order" ? 1 : 0,
        totalWhatsApp: type === "whatsapp" ? 1 : 0
      });
    });

    /* ================= 3. PRODUCT ANALYTICS ================= */
    if (data.asin) {
      const analyticsRef = doc(db, "analytics_products", data.asin);

      updateDoc(analyticsRef, {
        ...(type === "click" && { clicks: increment(1) }),
        ...(type === "order" && { orders: increment(1) }),
        ...(type === "whatsapp" && { whatsapp: increment(1) })
      }).catch(() => {
        setDoc(analyticsRef, {
          asin: data.asin,
          clicks: type === "click" ? 1 : 0,
          orders: type === "order" ? 1 : 0,
          whatsapp: type === "whatsapp" ? 1 : 0,
          category: data.category || "unknown"
        });
      });

      /* ================= 4. AI SCORE ================= */
      const productRef = doc(db, "products", data.asin);

      const weight =
        type === "click" ? 0.3 :
        type === "order" ? 1.2 :
        type === "whatsapp" ? 0.6 : 0;

      updateDoc(productRef, {
        clicks: type === "click" ? increment(1) : increment(0),
        orders: type === "order" ? increment(1) : increment(0),
        whatsapp: type === "whatsapp" ? increment(1) : increment(0),
        score: increment(weight)
      }).catch(() => {
        setDoc(productRef, {
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
      console.log("🔥 Tracked:", eventData);
    }

  } catch (err) {
    console.error("❌ Tracking Error:", err);
  }
                  }
