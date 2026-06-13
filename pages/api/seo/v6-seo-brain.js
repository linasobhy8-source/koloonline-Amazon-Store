export default async function handler(req, res) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://koloonline.online";

    const { type = "all", force = false } = req.body || {};

    console.log("🧠 V6 SEO BRAIN STARTED:", { type });

    /* ================= SAFE FETCH ================= */
    const safeFetch = async (url, options = {}) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeout);
        return { ok: true, status: res.status };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    };

    /* ================= INTELLIGENCE SIGNALS ================= */
    const signals = {
      content: {
        blog: type === "blog" || type === "all",
        product: type === "product" || type === "all",
      },

      ranking: {
        homeFeed: true,
        neuralBoost: true,
        profitBoost: true,
      },

      seo: {
        indexNow: true,
        sitemap: true,
        ping: true,
      },
    };

    /* ================= SIMPLE INTELLIGENCE SCORE ================= */
    let score = 50;

    if (type === "blog") score += 15;
    if (type === "product") score += 15;
    if (force) score += 20;

    const isAggressiveMode = score >= 80;

    console.log("📊 Brain Score:", score);

    /* ================= ACTION QUEUE ================= */
    const actions = [];

    // Core systems (always run)
    actions.push(
      safeFetch(`${baseUrl}/api/home-feed`, { method: "POST" })
    );

    actions.push(
      safeFetch(`${baseUrl}/api/neural-ranking-engine-v2`, {
        method: "POST",
      })
    );

    actions.push(
      safeFetch(`${baseUrl}/api/ai-profit-engine-v2`, {
        method: "POST",
      })
    );

    actions.push(
      safeFetch(`${baseUrl}/api/sitemap`, { method: "POST" })
    );

    actions.push(
      safeFetch(`${baseUrl}/api/indexnow`, { method: "POST" })
    );

    /* ================= CONDITIONAL BOOSTING ================= */

    if (isAggressiveMode) {
      console.log("🔥 AGGRESSIVE MODE ACTIVE");

      actions.push(
        safeFetch(`${baseUrl}/api/seo/discover-brain`, {
          method: "POST",
        })
      );

      actions.push(
        safeFetch(`${baseUrl}/api/seo/traffic-os`, {
          method: "POST",
        })
      );

      actions.push(
        safeFetch(`${baseUrl}/api/seo/flywheel-engine`, {
          method: "POST",
        })
      );
    }

    /* ================= TYPE-SPECIFIC LOGIC ================= */

    if (signals.content.blog) {
      actions.push(
        safeFetch(`${baseUrl}/api/seo/self-learning-loop`, {
          method: "POST",
        })
      );
    }

    if (signals.content.product) {
      actions.push(
        safeFetch(`${baseUrl}/api/seo/revenue-os`, {
          method: "POST",
        })
      );
    }

    /* ================= EXECUTION ================= */
    const results = await Promise.allSettled(actions);

    const successCount = results.filter(
      (r) => r.status === "fulfilled"
    ).length;

    console.log(
      `✅ SEO BRAIN DONE: ${successCount}/${actions.length}`
    );

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      message: "V6 SEO Brain executed successfully",

      meta: {
        type,
        score,
        aggressive: isAggressiveMode,
      },

      signals,
      stats: {
        totalActions: actions.length,
        success: successCount,
      },
    });
  } catch (e) {
    console.error("❌ V6 SEO BRAIN ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
      }
