export default async function handler(req, res) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://koloonline.online";

    const { mode = "full" } = req.query;

    console.log("🚀 AUTO TRIGGER STARTED:", mode);

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

    /* ================= PHASE 1: CORE SEO ================= */
    const phase1 = [
      safeFetch(`${baseUrl}/api/seo/os-core?mode=full`),
      safeFetch(`${baseUrl}/api/sitemap`, { method: "POST" }),
      safeFetch(`${baseUrl}/api/indexnow`, { method: "POST" }),
    ];

    /* ================= PHASE 2: INTELLIGENCE ================= */
    const phase2 = [
      safeFetch(`${baseUrl}/api/seo/v6-seo-brain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "all" }),
      }),
      safeFetch(`${baseUrl}/api/seo/seo-orchestrator`, {
        method: "POST",
      }),
    ];

    /* ================= PHASE 3: PROFIT + TRAFFIC ================= */
    const phase3 =
      mode === "full"
        ? [
            safeFetch(`${baseUrl}/api/seo/traffic-os`, {
              method: "POST",
            }),
            safeFetch(`${baseUrl}/api/seo/revenue-os`, {
              method: "POST",
            }),
            safeFetch(`${baseUrl}/api/seo/flywheel-engine`, {
              method: "POST",
            }),
          ]
        : [];

    /* ================= EXECUTION ================= */
    const results = await Promise.allSettled([
      ...phase1,
      ...phase2,
      ...phase3,
    ]);

    const success = results.filter(
      (r) => r.status === "fulfilled"
    ).length;

    console.log(
      `✅ AUTO TRIGGER DONE: ${success}/${results.length}`
    );

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      mode,
      stats: {
        total: results.length,
        success,
        failed: results.length - success,
      },
      message: "Auto SEO System executed successfully",
    });
  } catch (e) {
    console.error("❌ AUTO TRIGGER ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
                      }
