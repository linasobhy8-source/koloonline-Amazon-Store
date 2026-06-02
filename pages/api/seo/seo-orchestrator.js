export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";

    console.log("🤖 SEO ORCHESTRATOR STARTED");

    /* ================= SAFE FETCH WRAPPER ================= */
    const fetchWithTimeout = async (url, options = {}, timeout = 8000) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timer);
        return response;
      } catch (error) {
        clearTimeout(timer);
        throw error;
      }
    };

    /* ================= LOAD CONTENT SIGNALS ================= */
    let products = [];
    let blogs = [];

    try {
      const [prodRes, blogRes] = await Promise.all([
        fetchWithTimeout(`${baseUrl}/api/get-recommendations?type=products`),
        fetchWithTimeout(`${baseUrl}/api/get-recommendations?type=blog`),
      ]);

      const prodData = await prodRes.json().catch(() => ({}));
      const blogData = await blogRes.json().catch(() => ({}));

      products = prodData?.items || [];
      blogs = blogData?.items || [];
    } catch (error) {
      console.log("⚠️ Content fetch failed:", error.message);
    }

    /* ================= SAFE SCORING ENGINE ================= */
    const scoreItem = (item, type = "general") => {
      if (!item) return 0;

      let score = 40;

      // Content quality signals
      if (item.title) score += 10;
      if (item.image) score += 10;
      if (item.slug) score += 5;

      // Engagement signals
      if (item.views > 50) score += 10;
      if (item.clicks > 20) score += 10;
      if (item.conversions > 5) score += 15;

      // Freshness factor
      const updated = new Date(item.updatedAt || item.createdAt || Date.now());
      const diffDays =
        (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays < 3) score += 10;
      else if (diffDays < 7) score += 5;

      // Type weighting
      if (type === "product") score += 5;
      if (type === "blog") score += 3;

      return Math.min(100, score);
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

    console.log(
      "🔥 TOP PRODUCTS:",
      rankedProducts.map((p) => p.id)
    );

    console.log(
      "📚 TOP BLOGS:",
      rankedBlogs.map((b) => b.id)
    );

    /* ================= ORCHESTRATOR RUNNER ================= */
    const runOrchestrator = async (type, id) => {
      try {
        await fetchWithTimeout(
          `${baseUrl}/api/seo/seo-orchestrator-run`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, id }),
          }
        );
      } catch (error) {
        console.log("⚠️ Orchestrator error:", error.message);
      }
    };

    /* ================= SAFE BATCH PROCESSING ================= */
    const processBatch = async (items, type) => {
      for (const item of items) {
        if (!item?.id) continue;
        await runOrchestrator(type, item.id);
      }
    };

    await processBatch(rankedProducts, "product");
    await processBatch(rankedBlogs, "blog");

    /* ================= LOGGING ================= */
    try {
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
    } catch (error) {
      console.log("⚠️ Log error:", error.message);
    }

    console.log("✅ SEO ORCHESTRATOR COMPLETED");

    return res.status(200).json({
      success: true,
      message: "SEO Orchestrator executed successfully",
      processed: {
        products: rankedProducts.length,
        blogs: rankedBlogs.length,
      },
    });
  } catch (error) {
    console.error("❌ SEO ORCHESTRATOR FAILED:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
      }
