const FALLBACK =
  "https://via.placeholder.com/500?text=Koloonline";

export function optimizeAmazonImage(url) {
  try {
    if (
      !url ||
      typeof url !== "string"
    ) {
      return FALLBACK;
    }

    if (!url.startsWith("http")) {
      return FALLBACK;
    }

    if (
      url.includes("m.media-amazon.com")
    ) {
      return url
        .replace(
          "._AC_SL1500_.",
          "._AC_SL500_."
        )
        .replace(
          "._AC_SX679_.",
          "._AC_SL500_."
        )
        .replace(
          "._AC_SY679_.",
          "._AC_SL500_."
        )
        .replace(
          "._AC_UL1500_.",
          "._AC_SL500_."
        );
    }

    return url;
  } catch (error) {
    console.error(
      "Image optimization error:",
      error
    );

    return FALLBACK;
  }
}
