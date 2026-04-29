import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, setDoc } from "firebase/firestore";

/* ================= COUNTRY DETECTION ================= */
export function getCountry() {
  const lang = navigator?.language || "en-US";

  if (lang.includes("ar")) return "EG";
  if (lang.includes("en-CA")) return "CA";
  if (lang.includes("pl")) return "PL";
  return "US";
}

/* ================= MAIN TRACK FUNCTION ================= */
export async function trackEvent(type, data = {}) {
  try {

    const eventData = {
      type,
      country: getCountry(),
      timestamp: serverTimestamp(),
      url: window.location?.href || "",
      ...data
    };

    /* ================= 1. SAVE RAW EVENTS ================= */
    await addDoc(collection(db, "events"), eventData);

    /* ================= 2. UPDATE OVERVIEW STATS ================= */
    const overviewRef = doc(db, "analytics", "overview");

    await setDoc(overviewRef, {
      totalClicks: 0,
      totalOrders: 0,
      totalWhatsApp: 0
    }, { merge: true });

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
      const productRef = doc(db, "analytics_products", data.asin);

      await setDoc(productRef, {
        asin: data.asin,
        clicks: 0,
        orders: 0,
        whatsapp: 0
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
