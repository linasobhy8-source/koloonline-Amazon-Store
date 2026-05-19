import { getTopQueries } from "../lib/seo/searchConsoleMock";
import { enhancePost } from "../engine/contentEnhancer";
import { createNewContent } from "../engine/contentGenerator";

/* ================= NEURAL LOOP ================= */
export async function neuralFeedbackLoop() {
  try {
    /* ================= 1. GET SEO DATA ================= */
    const queries = await getTopQueries();

    /* ================= 2. FIND OPPORTUNITIES ================= */
    const opportunities = queries
      .filter((q) => q.impressions > 100 && q.ctr < 0.1)
      .map((q) => ({
        keyword: q.keyword,
        score: q.impressions / (q.ctr + 0.01),
      }))
      .sort((a, b) => b.score - a.score);

    /* ================= 3. ENHANCE EXISTING CONTENT ================= */
    const updatedPosts = [];

    for (let q of opportunities.slice(0, 3)) {
      try {
        const result = await enhancePost(q.keyword);
        updatedPosts.push(result);
      } catch (err) {
        console.error("Enhance error:", q.keyword, err.message);
      }
    }

    /* ================= 4. CREATE NEW CONTENT ================= */
    const newPosts = [];

    for (let q of queries.slice(0, 3)) {
      try {
        const post = await createNewContent(q.keyword);
        newPosts.push(post);
      } catch (err) {
        console.error("Create error:", q.keyword, err.message);
      }
    }

    /* ================= FINAL OUTPUT ================= */
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
