export function calculateBrainScore({ views, clicks, orders, price }) {
  const ctr = views ? clicks / views : 0;
  const cvr = clicks ? orders / clicks : 0;
  const revenue = orders * price;

  return (
    revenue * 15 +
    ctr * 300 +
    cvr * 800 +
    views * 0.2
  );
}
