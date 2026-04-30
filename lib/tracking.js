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

/* ================= SAFE WINDOW ================= */
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
      country: getCountry(),
      timestamp: serverTimestamp(),
      url: getSafeUrl()
    };

    /* ================= 1. RAW EVENTS ================= */
    addDoc(collection(db, "events"), eventData).catch(() => {});

    /* ================= 2. GLOBAL ANALYTICS ================= */
    const overviewRef = doc(db, "analytics", "overview");

    await updateDoc(overviewRef, {
      ...(type === "click" && { totalClicks: increment(1) }),
      ...(type === "order" && { totalOrders: increment(1) }),
      ...(type === "whatsapp" && { totalWhatsApp: increment(1) })
    }).catch(async () => {
      // لو مش موجود
      await setDoc(overviewRef, {
        totalClicks: type === "click" ? 1 : 0,
        totalOrders: type === "order" ? 1 : 0,
        totalWhatsApp: type === "whatsapp" ? 1 : 0
      });
    });

    /* ================= 3. PRODUCT ANALYTICS ================= */
    if (data.asin) {
      const productRef = doc(db, "analytics_products", data.asin);

      await updateDoc(productRef, {
        ...(type === "click" && { clicks: increment(1) }),
        ...(type === "order" && { orders: increment(1) }),
        ...(type === "whatsapp" && { whatsapp: increment(1) })
      }).catch(async () => {
        await setDoc(productRef, {
          asin: data.asin,
          clicks: type === "click" ? 1 : 0,
          orders: type === "order" ? 1 : 0,
          whatsapp: type === "whatsapp" ? 1 : 0
        });
      });
    }

    /* ================= 4. DEBUG ================= */
    if (process.env.NODE_ENV === "development") {
      console.log("🔥 Tracked:", eventData);
    }

  } catch (err) {
    console.error("❌ Tracking Error:", err);
  }
                  }
