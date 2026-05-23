export default async function handler(req, res) {
  try {
    const { products } = req.body;

    const winners = products
      .map((p) => {
        const score =
          (p.views || 0) +
          (p.clicks || 0) * 2 +
          (p.orders || 0) * 5 +
          (p.viralBoost ? 50 : 0);

        return { ...p, score };
      })
      .filter((p) => p.score > 120)
      .sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      winners,
      total: winners.length,
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
