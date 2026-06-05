export function optimizeAmazonImage(url) {
  if (!url) return "https://via.placeholder.com/500";

  if (url.includes("m.media-amazon.com")) {
    return url.replace("_AC_SX679_", "_AC_SL500_");
  }

  return url;
}
