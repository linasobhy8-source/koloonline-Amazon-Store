export function calculateBrainScore({
  views = 0,
  clicks = 0,
  orders = 0,
  price = 0,
}) {
  const ctr = views ? clicks / views : 0;
  const cvr = clicks ? orders / clicks : 0;
  const revenue = orders * price;

  return (
    revenue * 20 +
    ctr * 500 +
    cvr * 1200 +
    views * 0.3
  );
}lib/revenue-intelligence.js
