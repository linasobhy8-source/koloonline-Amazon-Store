export default async function handler(req, res) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://koloonline.online";

    console.log("🤖 SEO ORCHESTRATOR STARTED");

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
      } catch (e) {
        clearTimeout(timer);
        return null;
      }
    };

    /* ================= LOAD SIGNALS ================= */
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

      products = (await pRes?.json?.().catch(() => ({})))?.items || [];
      blogs = (await bRes?.json?.().catch(() => ({})))?.items || [];
    } catch (e) {
      console.log("⚠️ fetch failed:", e.message);
    }

    /* ================= SMART SCORING ================= */
    const scoreItem = (item, type) => {
      if (!item) return 0;

      let score = 30;

      // content quality
      score += item.title ? 10 : 0;
      score += item.image ? 8 : 0;
      score += item.slug ? 5 : 0;

      // engagement signals
      score += Math.min(20, (item.views || 0) / 10);
      score += Math.min(20, (item.clicks || 0) / 5);
      score += Math.min(25, (item.conversions || 0) * 5);

      // freshness
      const updated = new Date(
        item.updatedAt || item.createdAt || Date.now()
      );

      const ageDays =
        (Date.now() - updated.getTime()) /
        (1000 * 60 * 60 * 24);

      if (ageDays < 2) score += 15;
      else if (ageDays < 7) score += 8;

      // type boost
      if (type === "product") score += 5;
      if (type === "blog") score += 3;

      return Math.min(100, Math.round(score));
    };

    /* ================= RANKING ================= */
    const rankedProducts = products
      .map((p) => ({
        ...p,
        score: scoreItem(p, "product"),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const rankedBlogs = blogs
      .map((b) => ({
        ...b,
        score: scoreItem(b, "blog"),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    console.log("🔥 TOP PRODUCTS:", rankedProducts.map((p) => p.id));
    console.log("📚 TOP BLOGS:", rankedBlogs.map((b) => b.id));

    /* ================= THROTTLED RUNNER ================= */
    const runOrchestrator = async (type, id) => {
      await fetchWithTimeout(
        `${baseUrl}/api/seo/seo-orchestrator-run`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, id }),
        }
      );
    };

    /* ================= PARALLEL SAFE EXECUTION ================= */
    const runBatch = async (items, type) => {
      const tasks = items
        .filter((i) => i?.id)
        .map((i) => runOrchestrator(type, i.id));

      await Promise.allSettled(tasks);
    };

    await Promise.all([
      runBatch(rankedProducts, "product"),
      runBatch(rankedBlogs, "blog"),
    ]);

    /* ================= LOGGING ================= */
    await fetchWithTimeout(`${baseUrl}/api/cron-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "seo_orchestrator",
        status: "success",
        products: rankedProducts.length,
        blogs: rankedBlogs.length,
        timestamp: new Date().toISOString(),
      }),
    });

    console.log("✅ SEO ORCHESTRATOR COMPLETED");

    return res.status(200).json({
      success: true,
      engine: "seo-orchestrator-v2",

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
