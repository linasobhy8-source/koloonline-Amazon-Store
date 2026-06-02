/* ================= SMART CDN IMAGE OPTIMIZER ================= */

const fallback =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* compress Amazon images + proxy */
export function cdnImage(url) {
  if (!url) return fallback;

  try {
    // Amazon images optimization
    if (url.includes("amazon")) {
      return url
        .replace("._SL1500_", "._SL800_")
        .replace("._SL1200_", "._SL800_")
        .replace("._AC_SL1500_", "._AC_SL800_")
        .replace("._AC_SL1200_", "._AC_SL800_");
    }

    // Firebase / external CDN
    if (url.includes("googleusercontent") || url.includes("firebase")) {
      return url;
    }

    return url;
  } catch {
    return fallback;
  }
}
