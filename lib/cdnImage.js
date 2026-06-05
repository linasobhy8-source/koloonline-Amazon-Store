export function cdnImage(url) {
  const fallback =
    "https://via.placeholder.com/500x500?text=Koloonline";

  if (!url) return fallback;

  try {
    if (url.includes("amazon")) {
      return url
        .replace("._SL1500_", "._SL600_")
        .replace("._SL1200_", "._SL600_")
        .replace("._AC_SL1500_", "._AC_SL600_")
        .replace("._AC_SL1200_", "._AC_SL600_");
    }

    return url;
  } catch {
    return fallback;
  }
}
