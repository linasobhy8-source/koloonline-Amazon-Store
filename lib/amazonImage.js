export function optimizeAmazonImage(url) {
  if (!url) {
    return "https://via.placeholder.com/500x500?text=Koloonline";
  }

  // لو صورة أمازون
  if (url.includes("m.media-amazon.com")) {
    // تحويلها لأخف نسخة + WebP لو متاح
    return url
      .replace("_AC_SX679_", "_AC_SL500_")
      .replace("_AC_SY679_", "_AC_SL500_")
      .replace("_AC_UL1500_", "_AC_SL500_");
  }

  return url;
}
