export function revenueScore(p) {
  const views = p.views || 0;
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;
  const price = p.price || 1;

  const ctr = views ? clicks / views : 0;
  const cvr = clicks ? orders / clicks : 0;
  const revenue = orders * price;

  const viral = p.viralBoost ? 2 : 1;

  return (
    revenue * 10 +
    ctr * 200 +
    cvr * 500 +
    views * 0.1 +
    viral * 100
  );
}
