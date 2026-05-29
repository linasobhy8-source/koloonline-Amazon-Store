export default function handler(req, res) {
  const { pageType, score } = req.body || {};

  const signal = {
    ads_ready: score >= 60,
    page_type: pageType,
    quality: score,
    timestamp: Date.now(),
    safe_ads: true,
  };

  return res.status(200).json({
    success: true,
    signal,
  });
}
