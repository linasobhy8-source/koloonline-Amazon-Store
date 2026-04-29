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
  const lang = navigator?.language || "en-US";

  if (lang.includes("ar")) return "EG";
  if (lang.includes("en-CA")) return "CA";
  if (lang.includes("pl")) return "PL";
  return "US";
}

/* ================= TRACK ================= */
export async function trackEvent(type, data = {}) {
  try {

    const eventData = {
      type,
      country: getCountry(),
      timestamp: serverTimestamp(),
      url: window.location?.href || "",
      ...data
    };

    /* ================= RAW EVENTS ================= */
    await addDoc(collection(db, "events"), eventData);

    /* ================= OVERVIEW (NO RESET) ================= */
    const overviewRef = doc(db, "analytics", "overview");

    // إنشاء مرة واحدة فقط (لو مش موجود)
    await setDoc(overviewRef, {}, { merge: true });

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

    /* ================= PRODUCT ANALYTICS ================= */
    if (data.asin) {
      const productRef = doc(db, "analytics_products", data.asin);

      // إنشاء مرة واحدة فقط
      await setDoc(productRef, {
        asin: data.asin
      }, { merge: true });

      if (type === "click") {
        await updateDoc(productRef, {
          clicks: increment(1)
        });
      }

      if (type === "order") {
        await updateDoc(productRef, {
          orders: increment(1)
        });
      }

      if (type === "whatsapp") {
        await updateDoc(productRef, {
          whatsapp: increment(1)
        });
      }
    }

    console.log("🔥 Tracked:", eventData);

  } catch (err) {
    console.error("Tracking Error:", err);
  }
}
