export default async function handler(req, res) {
  try {
    const { product } = req.body;

    function predictWin(p) {
      let score = 0;

      const margin = (p.price || 0) - (p.cost || 0);

      // profit strength
      if (margin > 20) score += 40;
      if (margin > 50) score += 70;

      // demand signals
      score += (p.views || 0) * 0.3;
      score += (p.clicks || 0) * 1.5;

      // conversion strength
      const ctr = p.views ? p.clicks / p.views : 0;
      score += ctr * 120;

      // viral probability
      if (p.viralBoost) score += 60;

      return score;
    }

    const score = predictWin(product);

    const decision =
      score > 120
        ? "WINNER"
        : score > 80
        ? "POTENTIAL"
        : "REJECT";

    return res.status(200).json({
      success: true,
      score,
      decision,
    });

  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
}
