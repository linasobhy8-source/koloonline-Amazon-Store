export function optimizeImage(url) {
  if (!url) return "/placeholder.png";

  if (url.includes("amazon")) {
    return url.replace("_AC_SX679_", "_AC_SL400_");
  }

  return url;
}
