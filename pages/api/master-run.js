import autoGenerate from "./auto-create-page";
import syncProducts from "./sync-products";
import trending from "./trending";
import indexNow from "./indexnow";
import autoPublish from "./auto-publish";

/* ================= SAFE EXECUTION WRAPPER ================= */

async function runSafe(fn, name) {
  try {
    if (typeof fn !== "function") {
      console.warn(`⚠ ${name} is not a function`);
      return { name, status: "skipped" };
    }

    const result = await fn();

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
      runSafe(autoGenerate, "autoGenerate"),
      runSafe(syncProducts, "syncProducts"),
      runSafe(trending, "trending"),
      runSafe(indexNow, "indexNow"),
      runSafe(autoPublish, "autoPublish"),
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
