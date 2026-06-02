import { getTopQueries } from "../lib/seo/searchConsoleMock";
import { enhancePost } from "../engine/contentEnhancer";
import { createNewContent } from "../engine/contentGenerator";

/* ================= NEURAL FEEDBACK LOOP ================= */
export async function neuralFeedbackLoop() {
  try {
    /* ================= SEO DATA ================= */
    const queries = await getTopQueries();

    /* ================= OPPORTUNITIES DETECTION ================= */
    const opportunities = queries
      .filter((q) => q.impressions > 100 && q.ctr < 0.1)
      .map((q) => ({
        keyword: q.keyword,
        score: q.impressions / (q.ctr + 0.01),
      }))
      .sort((a, b) => b.score - a.score);

    /* ================= CONTENT IMPROVEMENT ================= */
    const updatedPosts = [];

    for (const q of opportunities.slice(0, 3)) {
      try {
        const result = await enhancePost(q.keyword);
        updatedPosts.push(result);
      } catch (err) {
        console.error("Enhancement error:", q.keyword, err.message);
      }
    }

    /* ================= NEW CONTENT CREATION ================= */
    const newPosts = [];

    for (const q of queries.slice(0, 3)) {
      try {
        const post = await createNewContent(q.keyword);
        newPosts.push(post);
      } catch (err) {
        console.error("Content creation error:", q.keyword, err.message);
      }
    }

    /* ================= RESPONSE ================= */
    return {
      success: true,

      updatedPosts,
      newPosts,
      opportunities,

      stats: {
        totalQueries: queries.length,
        opportunitiesFound: opportunities.length,
        updated: updatedPosts.length,
        created: newPosts.length,
      },
    };

  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
}
