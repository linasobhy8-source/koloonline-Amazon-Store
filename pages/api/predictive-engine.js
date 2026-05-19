export default async function handler(req, res) {
  try {
    const { keywords = [] } = req.body || {};

    const predictions = keywords.map(k => {
      const score =
        k.includes("2026") ? 90 :
        k.includes("best") ? 80 :
        k.includes("cheap") ? 70 :
        50;

      return {
        keyword: k,
        trendScore: score,
        willTrend: score > 75
      };
    });

    return res.status(200).json({
      success: true,
      predictions
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
