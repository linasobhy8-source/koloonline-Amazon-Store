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

/* ================= COUNTRY ================= */
export function getCountry() {
  if (typeof window === "undefined") return "US";

  const lang = navigator.language || "en-US";

  if (lang.includes("ar")) return "EG";
  if (lang.includes("pl")) return "PL";
  if (lang.includes("en-CA")) return "CA";
  return "US";
}

/* ================= TRACK EVENT ================= */
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

    /* ================= OVERVIEW ================= */
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

    /* ================= PRODUCT ANALYTICS ================= */
    if (data.asin) {
      const productRef = doc(db, "analytics_products", data.asin);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        await setDoc(productRef, {
          asin: data.asin,
          clicks: 0,
          orders: 0,
          whatsapp: 0
        });
      }

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
