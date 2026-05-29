export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";

    console.log("🤖 AUTONOMOUS SEO SYSTEM STARTED");

    /* ================= 1️⃣ GET CONTENT SIGNALS ================= */
    let products = [];
    let blogs = [];

    try {
      const prodRes = await fetch(`${baseUrl}/api/get-recommendations?type=products`);
      const blogRes = await fetch(`${baseUrl}/api/get-recommendations?type=blog`);

      const prodData = await prodRes.json();
      const blogData = await blogRes.json();

      products = prodData?.items || [];
      blogs = blogData?.items || [];
    } catch (e) {
      console.log("Data fetch error:", e.message);
    }

    /* ================= 2️⃣ SCORING SYSTEM ================= */
    function scoreItem(item, type) {
      let score = 50;

      if (!item) return 0;

      if (item.title) score += 10;
      if (item.image) score += 10;
      if (item.views > 100) score += 10;
      if (item.clicks > 50) score += 10;

      if (type === "blog") score += 5;
      if (type === "product") score += 10;

      return Math.min(100, score);
    }

    /* ================= 3️⃣ PICK BEST ITEMS ================= */
    const rankedProducts = products
      .map(p => ({
        ...p,
        score: scoreItem(p, "product"),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const rankedBlogs = blogs
      .map(b => ({
        ...b,
        score: scoreItem(b, "blog"),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    console.log("🔥 TOP PRODUCTS:", rankedProducts.map(p => p.id));
    console.log("📚 TOP BLOGS:", rankedBlogs.map(b => b.id));

    /* ================= 4️⃣ RUN SEO ORCHESTRATOR ================= */
    async function runOrchestrator(type, id) {
      try {
        await fetch(`${baseUrl}/api/seo/seo-orchestrator`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            id,
          }),
        });
      } catch (e) {
        console.log("Orchestrator error:", e.message);
      }
    }

    /* ================= 5️⃣ EXECUTION ================= */
    for (const p of rankedProducts) {
      await runOrchestrator("product", p.id);
    }

    for (const b of rankedBlogs) {
      await runOrchestrator("blog", b.id);
    }

    /* ================= FINAL LOG ================= */
    console.log("✅ AUTONOMOUS SEO CYCLE COMPLETED");

    return res.status(200).json({
      success: true,
      message: "Autonomous SEO executed",
      processed: {
        products: rankedProducts.length,
        blogs: rankedBlogs.length,
      },
    });

  } catch (e) {
    console.error("❌ AUTONOMOUS SEO ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
