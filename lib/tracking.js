import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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

    // Save to Firebase
    await addDoc(collection(db, "events"), eventData);

    // Debug
    console.log("🔥 Firebase Event:", eventData);

  } catch (err) {
    console.error("Tracking Error:", err);
  }
}
