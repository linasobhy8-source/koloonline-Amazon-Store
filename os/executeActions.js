import { updateHomepageCache } from "../lib/cache/homeCache";
import { pushToIndexing } from "../lib/seo/indexPush";

/* ================= EXECUTION ENGINE ================= */
export async function executeActions(decisions) {
  const actions = [];

  try {
    if (decisions.homepage) {
      await updateHomepageCache(decisions.homepage);
      actions.push("homepage_updated");
    }

    if (decisions.revenue) {
      await pushToIndexing(decisions.revenue);
      actions.push("revenue_indexed");
    }

    if (decisions.viral) {
      await pushToIndexing(decisions.viral);
      actions.push("viral_pushed");
    }

    return actions;

  } catch (e) {
    return ["execution_error"];
  }
}
