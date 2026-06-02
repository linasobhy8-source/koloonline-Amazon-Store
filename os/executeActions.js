import { updateHomepageCache } from "../lib/cache/homeCache";
import { pushToIndexing } from "../lib/seo/indexPush";

/* ================= EXECUTION ENGINE ================= */
export async function executeActions(decisions = {}) {
  const actions = [];

  try {
    /* ================= HOMEPAGE UPDATE ================= */
    if (decisions.homepage && Array.isArray(decisions.homepage)) {
      await updateHomepageCache(decisions.homepage);
      actions.push("homepage_cache_updated");
    }

    /* ================= REVENUE INDEXING ================= */
    if (decisions.revenue && Array.isArray(decisions.revenue)) {
      await pushToIndexing(decisions.revenue);
      actions.push("revenue_content_indexed");
    }

    /* ================= VIRAL CONTENT PUSH ================= */
    if (decisions.viral && Array.isArray(decisions.viral)) {
      await pushToIndexing(decisions.viral);
      actions.push("viral_content_indexed");
    }

    return {
      success: true,
      actions,
    };

  } catch (e) {
    return {
      success: false,
      actions: ["execution_error"],
      error: e.message,
    };
  }
}
