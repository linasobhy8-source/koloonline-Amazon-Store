export default async function handler(req, res) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://koloonline.online";

    console.log("🧠 AI MASTER ORCHESTRATOR v4 STARTED");

    /* ================= SAFE FETCH ================= */
    const fetchWithTimeout = async (url, options = {}, timeout = 9000) => {
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

    /* ================= LOAD SIGNALS ================= */
    let products = [];
    let blogs = [];

    try {
      const [pRes, bRes] = await Promise.all([
        fetchWithTimeout(`${baseUrl}/api/get-recommendations?type=products`),
        fetchWithTimeout(`${baseUrl}/api/get-recommendations?type=blog`),
      ]);

      const pJson = await pRes?.json?.().catch(() => ({}));
      const bJson = await bRes?.json?.().catch(() => ({}));

      products = pJson?.items || [];
      blogs = bJson?.items || [];
    } catch (e) {
      console.log("⚠️ DATA LOAD ERROR:", e.message);
    }

    /* ================= AI CORE SCORING ================= */
    const scoreItem = (item) => {
      const views = Number(item?.views) || 0;
      const clicks = Number(item?.clicks) || 0;
      const orders = Number(item?.orders) || 0;

      const ctr = views > 0 ? clicks / views : 0;
      const conv = clicks > 0 ? orders / clicks : 0;

      let score =
        ctr * 140 +
        conv * 300 +
        (item?.viralBoost ? 100 : 0) +
        (views > 100 ? 20 : 0) +
        (orders > 10 ? 50 : 0);

      /* ================= FRESHNESS ================= */
      const updated = new Date(
        item?.updatedAt || item?.createdAt || Date.now()
      );

      const ageHours =
        (Date.now() - updated.getTime()) / (1000 * 60 * 60);

      const freshness = 1 / Math.log(ageHours + 3);

      score = score * freshness;

      return Math.round(score);
    };

    /* ================= DECISION ENGINE ================= */
    const decide = (item) => {
      const score = item.score;

      if (score >= 500) return "elite_index";
      if (score >= 300) return "index_boost";
      if (score >= 150) return "index";
      if (score >= 80) return "maybe";
      return "reject";
    };

    /* ================= PROCESS PRODUCTS ================= */
    const processedProducts = products
      .map((p) => {
        const score = scoreItem(p);
        const decision = decide({ ...p, score });

        return {
          ...p,
          score,
          decision,
        };
      })
      .filter((p) => p.decision !== "reject")
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    /* ================= PROCESS BLOGS ================= */
    const processedBlogs = blogs
      .map((b) => {
        const score = scoreItem(b);
        const decision = score >= 120 ? "index" : "maybe";

        return {
          ...b,
          score,
          decision,
        };
      })
      .filter((b) => b.decision !== "reject")
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    console.log("🔥 TOP PRODUCTS:", processedProducts.map((p) => p.id));
    console.log("📚 TOP BLOGS:", processedBlogs.map((b) => b.id));

    /* ================= INDEXING SYSTEM ================= */
    const runAction = async (type, item) => {
      const endpoints = {
        index: "/api/seo/indexnow",
        boost: "/api/seo/indexnow",
        elite: "/api/seo/indexnow",
      };

      const endpoint = endpoints[type] || endpoints.index;

      return fetchWithTimeout(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          id: item.id,
          score: item.score,
          decision: item.decision,
        }),
      });
    };

    /* ================= AUTO EXECUTION ================= */
    const executeBatch = async (items) => {
      const tasks = items.map((item) => runAction(item.decision, item));
      await Promise.allSettled(tasks);
    };

    await Promise.all([
      executeBatch(processedProducts),
      executeBatch(processedBlogs),
    ]);

    /* ================= INDEXNOW BATCH ================= */
    const indexUrls = processedProducts.map(
      (p) => `${baseUrl}/product/${p.slug || p.id}`
    );

    if (indexUrls.length > 0) {
      await fetchWithTimeout(`${baseUrl}/api/indexnow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls: indexUrls.slice(0, 50),
        }),
      });
    }

    /* ================= LOGGING ================= */
    await fetchWithTimeout(`${baseUrl}/api/cron-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ai_master_orchestrator_v4",
        status: "success",
        products: processedProducts.length,
        blogs: processedBlogs.length,
        timestamp: new Date().toISOString(),
      }),
    });

    console.log("✅ AI MASTER ORCHESTRATOR v4 COMPLETED");

    return res.status(200).json({
      success: true,
      engine: "ai-master-orchestrator-v4",

      stats: {
        products: processedProducts.length,
        blogs: processedBlogs.length,
        indexed: indexUrls.length,
      },

      decisions: {
        elite: processedProducts.filter((p) => p.decision === "elite_index").length,
        boost: processedProducts.filter((p) => p.decision === "index_boost").length,
        index: processedProducts.filter((p) => p.decision === "index").length,
      },
    });
  } catch (e) {
    console.error("❌ MASTER ORCHESTRATOR FAILED:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
