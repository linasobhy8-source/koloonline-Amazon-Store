/* ================= STRATEGY MERGER ================= */
function mergeStrategies({
  market,
  ceoDecision,
  evolution,
  healing,
  neural,
}) {
  const trending = market?.trendingProducts?.length || 0;
  const top = market?.topProducts?.length || 0;
  const viral = market?.viralProducts?.length || 0;
  const opportunities = neural?.opportunities?.length || 0;
  const performance = evolution?.performanceScore || 0;
  const brokenPages = healing?.brokenPages || 0;

  const baseScore =
    trending * 2 +
    top * 3 +
    viral * 5 +
    opportunities * 4 +
    performance -
    brokenPages * 2;

  const commonActions = [
    "updateHomepage",
    "refreshRecommendations",
    "updateTrendingProducts",
    "cleanupBrokenLinks",
    "updateSitemap",
    "submitIndexNow",
  ];

  if (baseScore >= 200) {
    return {
      mode: "GROWTH_FOCUS",
      score: baseScore,
      ceoMode: ceoDecision?.strategy?.mode || "AUTO",

      actions: [
        "generateBlogArticles",
        "refreshTopPages",
        "highlightViralProducts",
        "refreshMetaTitles",
        "refreshMetaDescriptions",
        ...commonActions,
      ],
    };
  }

  if (baseScore >= 100) {
    return {
      mode: "OPTIMIZATION_FOCUS",
      score: baseScore,
      ceoMode: ceoDecision?.strategy?.mode || "AUTO",

      actions: [
        "refreshOldBlogs",
        "refreshTopPages",
        "optimizeTitles",
        "optimizeDescriptions",
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
      "refreshLowPerformingContent",
      "rebuildInternalLinks",
      ...commonActions,
    ],
  };
}
