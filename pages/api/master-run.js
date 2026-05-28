import autoGenerate from "./auto-create-page";
import syncProducts from "./sync-products";
import feed from "./feed";
import indexNow from "./indexnow";
import autoPublish from "./auto-publish";

/* ================= SAFE WRAPPER ================= */

async function runSafe(fn, name, req, res) {
  try {
    if (typeof fn !== "function") {
      return { name, status: "skipped" };
    }

    const result = await fn(req, res);

    return {
      name,
      status: "success",
      result: result || null,
    };
  } catch (error) {
    return {
      name,
      status: "failed",
      error: error.message,
    };
  }
}

/* ================= MASTER ORCHESTRATOR ================= */

export default async function handler(req, res) {
  try {
    const results = await Promise.allSettled([
      runSafe(autoGenerate, "autoGenerate", req, res),
      runSafe(syncProducts, "syncProducts", req, res),
      runSafe(feed, "feed", req, res),
      runSafe(indexNow, "indexNow", req, res),
      runSafe(autoPublish, "autoPublish", req, res),
    ]);

    const formatted = results.map((r) =>
      r.status === "fulfilled"
        ? r.value
        : { status: "failed", error: r.reason?.message }
    );

    return res.status(200).json({
      success: true,
      message: "🔥 Master pipeline executed successfully",
      timestamp: Date.now(),
      results: formatted,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
