export default async function handler(req, res) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://koloonline.online";

    console.log("🤖 SEO ORCHESTRATOR v3 STARTED");

    /* ================= SAFE FETCH ================= */
    const fetchWithTimeout = async (url, options = {}, timeout = 8000) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      try {
        const res = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timer);
        return res;
      } catch {
        clearTimeout(timer);
        return null;
      }
    };

    /* ================= LOAD DATA ================= */
    let products = [];
    let blogs = [];

    try {
      const [pRes, bRes] = await Promise.all([
        fetchWithTimeout(
          `${baseUrl}/api/get-recommendations?type=products`
        ),
        fetchWithTimeout(
          `${baseUrl}/api/get-recommendations?type=blog`
        ),
      ]);

      const pJson = await pRes?.json?.().catch(() => ({}));
      const bJson = await bRes?.json?.().catch(() => ({}));

      products = pJson?.items || [];
      blogs = bJson?.items || [];
    } catch (e) {
      console.log("⚠️ fetch failed:", e.message);
    }

    /* ================= IMPORT MASTER AI (IMPORTANT) ================= */
    // لازم يكون عندك decisionEngine موحد
    // import { decisionEngine } from "@/lib/ai/decisionEngine";

    const scoreItem = (item) => {
      const views = Number(item?.views) || 0;
      const clicks = Number(item?.clicks) || 0;
      const orders = Number(item?.orders) || 0;

      const ctr = views > 0 ? clicks / views : 0;
      const conv = clicks > 0 ? orders / clicks : 0;

      let score =
        ctr * 120 +
        conv * 250 +
        (item?.viralBoost ? 80 : 0) +
        (views > 100 ? 20 : 0);

      /* ================= FRESHNESS ================= */
      const updated = new Date(
        item?.updatedAt || item?.createdAt || Date.now()
      );

      const ageHours =
        (Date.now() - updated.getTime()) / (1000 * 60 * 60);

      const freshnessBoost = 1 / Math.log(ageHours + 3);

      score = score * freshnessBoost;

      if (!isFinite(score)) score = 0;

      return Math.round(score);
    };

    /* ================= RANK PRODUCTS ================= */
    const rankedProducts = products
      .map((p) => ({
        ...p,
        score: scoreItem(p),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    /* ================= RANK BLOGS ================= */
    const rankedBlogs = blogs
      .map((b) => ({
        ...b,
        score: scoreItem(b),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    console.log("🔥 TOP PRODUCTS:", rankedProducts.map((p) => p.id));
    console.log("📚 TOP BLOGS:", rankedBlogs.map((b) => b.id));

    /* ================= ORCHESTRATOR RUNNER ================= */
    const runOrchestrator = async (type, id) => {
      return fetchWithTimeout(
        `${baseUrl}/api/seo/seo-orchestrator-run`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, id }),
        }
      );
    };

    /* ================= BATCH EXECUTION ================= */
    const runBatch = async (items, type) => {
      const tasks = items
        .filter((i) => i?.id)
        .map((i) => runOrchestrator(type, i.id));

      await Promise.allSettled(tasks);
    };

    /* ================= PARALLEL EXECUTION ================= */
    await Promise.all([
      runBatch(rankedProducts, "product"),
      runBatch(rankedBlogs, "blog"),
    ]);

    /* ================= LOGGING ================= */
    await fetchWithTimeout(`${baseUrl}/api/cron-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "seo_orchestrator_v3",
        status: "success",
        products: rankedProducts.length,
        blogs: rankedBlogs.length,
        timestamp: new Date().toISOString(),
      }),
    });

    console.log("✅ SEO ORCHESTRATOR v3 COMPLETED");

    return res.status(200).json({
      success: true,
      engine: "seo-orchestrator-v3",

      processed: {
        products: rankedProducts.length,
        blogs: rankedBlogs.length,
      },
    });
  } catch (e) {
    console.error("❌ SEO ORCHESTRATOR FAILED:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
