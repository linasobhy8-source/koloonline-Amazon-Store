export function optimizeAmazonImage(url) {
  if (!url) return "https://via.placeholder.com/500";

  if (url.includes("m.media-amazon.com")) {
    return url
      .replace("_AC_SX679_", "_AC_SL400_")
      .replace("_AC_SY679_", "_AC_SL400_")
      .replace("_AC_UL1500_", "_AC_SL400_");
  }

  return url;
}
