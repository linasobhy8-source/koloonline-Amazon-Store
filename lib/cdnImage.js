/* ================= SMART CDN IMAGE OPTIMIZER ================= */

const fallback =
  "https://via.placeholder.com/500x500?text=Koloonline";

/**
 * Smart Image CDN optimizer:
 * - Amazon size optimization
 * - Auto proxy routing (for speed)
 * - Safe fallback handling
 */
export function cdnImage(url) {
  if (!url || typeof url !== "string") return fallback;

  try {
    let optimizedUrl = url;

    /* ================= AMAZON OPTIMIZATION ================= */
    if (url.includes("amazon")) {
      optimizedUrl = url
        .replace("._SL1500_", "._SL800_")
        .replace("._SL1200_", "._SL800_")
        .replace("._AC_SL1500_", "._AC_SL800_")
        .replace("._AC_SL1200_", "._AC_SL800_");
    }

    /* ================= FIREBASE / GOOGLE CDN ================= */
    if (
      url.includes("googleusercontent") ||
      url.includes("firebase") ||
      url.includes("firebasestorage")
    ) {
      return url;
    }

    /* ================= LOCAL PROXY (HIGH PERFORMANCE LAYER) ================= */
    const shouldProxy =
      url.includes("amazon") ||
      url.includes("media") ||
      url.includes("images");

    if (shouldProxy) {
      return `/api/image-proxy?url=${encodeURIComponent(
        optimizedUrl
      )}&w=600&q=70`;
    }

    /* ================= DEFAULT ================= */
    return optimizedUrl;
  } catch (e) {
    return fallback;
  }
}
