/* ================= SAFE NUMBER ================= */

function n(v) {
  return Number(v || 0);
}

/* ================= CONVERSION SCORE ================= */

export function conversionScore(product = {}) {

  const views =
    n(product.views);

  const clicks =
    n(product.clicks);

  const orders =
    n(product.orders);

  const whatsapp =
    n(product.whatsapp);

  const price =
    n(product.price);

  const score =
    n(product.score);

  /* ================= RATES ================= */

  const ctr =
    views > 0
      ? clicks / views
      : 0;

  const cvr =
    clicks > 0
      ? orders / clicks
      : 0;

  const whatsappRate =
    clicks > 0
      ? whatsapp / clicks
      : 0;

  /* ================= BASE ================= */

  let conversion =

    ctr * 140 +

    cvr * 420 +

    whatsappRate * 120 +

    orders * 18 +

    score * 2;

  /* ================= PRICE PSYCHOLOGY ================= */

  if (
    price >= 15 &&
    price <= 80
  ) {
    conversion += 35;
  }

  if (
    price > 80 &&
    price <= 150
  ) {
    conversion += 10;
  }

  if (price > 250) {
    conversion -= 25;
  }

  /* ================= SOCIAL BOOST ================= */

  if (product.viralBoost) {
    conversion += 30;
  }

  /* ================= FRESH BOOST ================= */

  if (
    product.updatedAt
  ) {
    conversion += 5;
  }

  /* ================= FINAL ================= */

  return Math.max(
    0,
    Math.round(conversion)
  );
}
