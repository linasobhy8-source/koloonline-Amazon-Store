export function optimizeAmazonImage(url) {
  if (!url) return "";

  if (url.includes("m.media-amazon.com")) {
    return url
      .replace(/\._.*_\./, "._SL1000_.") // أعلى جودة
      .replace(/._SX\d+_/, "._SL1000_");
  }

  return url;
}
