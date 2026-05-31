export function revenueBoost(p) {
  const ctr = p.views ? p.clicks / p.views : 0;
  const conv = p.clicks ? p.orders / p.clicks : 0;

  const adScore = ctr * 100;
  const affiliateScore = conv * 300;

  return {
    ...p,
    revenueScore: adScore + affiliateScore,
    adPriority: adScore > 50,
    affiliatePriority: affiliateScore > 80,
  };
}
