export function getAdsSlots(pageType) {
  switch (pageType) {
    case "blog":
      return [
        "after_intro",
        "middle_content",
        "before_related",
        "end_article",
      ];

    case "product":
      return ["under_title", "under_price", "before_related"];

    case "category":
      return ["top_banner", "middle_grid"];

    default:
      return ["bottom_page"];
  }
}

/* ================= ADS QUALITY BOOST SCORE ================= */
export function adsQualityScore(page) {
  let score = 0;

  // content length
  if ((page.content || "").length > 1000) score += 30;
  if ((page.content || "").length > 2000) score += 20;

  // images presence
  if (page.image) score += 15;

  // internal links
  if ((page.internalLinks || 0) > 3) score += 20;

  // structure
  if (page.title && page.excerpt) score += 15;

  // safe ads signal
  if (!page.isThinContent) score += 20;

  return Math.min(score, 100);
}

/* ================= ADS ELIGIBILITY ================= */
export function isAdsReady(page) {
  return adsQualityScore(page) >= 60;
}
