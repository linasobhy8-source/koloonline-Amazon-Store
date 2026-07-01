export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    const products = Array.isArray(req.body?.products)
      ? req.body.products
      : [];

    const winners = products
      .map((p) => {
        const score =
          Number(p.views || 0) +
          Number(p.clicks || 0) * 2 +
          Number(p.orders || 0) * 5 +
          (p.viralBoost ? 50 : 0);

        return {
          ...p,
          score,
        };
      })
      .filter((p) => p.score > 120)
      .sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      total: winners.length,
      winners,
    });
  } catch (error) {
    console.error("daily-autopilot:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
