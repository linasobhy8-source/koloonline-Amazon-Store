/* ================= STRATEGY MERGER ================= */
function mergeStrategies({
  market,
  ceoDecision,
  evolution,
  healing,
  neural,
}) {
  const baseScore =
    (market?.trendingProducts?.length || 0) * 2 +
    (market?.topProducts?.length || 0) * 3 +
    (market?.viralProducts?.length || 0) * 5 +
    (neural?.opportunities?.length || 0) * 4 +
    (evolution?.performanceScore || 0) -
    (healing?.brokenPages || 0) * 2;

  const commonActions = [
    "updateHomepage",
    "refreshRecommendations",
    "updateTrendingProducts",
    "refreshRelatedProducts",
    "cleanupBrokenLinks",
  ];

  /* ================= STRATEGY MODE DECISION ================= */
  if (baseScore > 200) {
    return {
      mode: "GROWTH_FOCUS",
      score: baseScore,
      ceoMode: ceoDecision?.strategy?.mode || "AUTO",
      actions: [
        "generateTopPages",
        "generateBlogArticles",
        "generateAmazonHaulPages",
        "generateSEOClusters",
        "generateBuyingGuides",
        "linkProductsToBlogs",
        "linkBlogsToTopPages",
        "linkAmazonHaulToProducts",
        "generateFAQSchema",
        "generateBreadcrumbSchema",
        "generateProductSchema",
        "updateSitemap",
        "submitIndexNow",
        "refreshMetaTitles",
        "refreshMetaDescriptions",
        "expandHomepageRecommendations",
        "highlightViralProducts",
        ...commonActions,
      ],
    };
  }

  if (baseScore > 100) {
    return {
      mode: "OPTIMIZATION_FOCUS",
      score: baseScore,
      ceoMode: ceoDecision?.strategy?.mode || "AUTO",
      actions: [
        "refreshOldBlogs",
        "refreshTopPages",
        "updateTrendingProducts",
        "optimizeTitles",
        "optimizeDescriptions",
        "improveInternalLinks",
        "updateSitemap",
        "submitIndexNow",
        "refreshAffiliateLinks",
        "optimizeCTR",
        ...commonActions,
      ],
    };
  }

  return {
    mode: "STABILITY_FOCUS",
    score: baseScore,
    ceoMode: ceoDecision?.strategy?.mode || "AUTO",
    actions: [
      "fixSEO",
      "repairBrokenPages",
      "removeDeadLinks",
      "removeOldSitemapEntries",
      "refreshLowPerformingContent",
      "rebuildInternalLinks",
      "updateSitemap",
      "submitIndexNow",
      ...commonActions,
    ],
  };
}
