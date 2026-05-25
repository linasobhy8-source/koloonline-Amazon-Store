/* ================= CLEAN ================= */

function clean(text = "") {
  return text
    .toLowerCase()
    .trim();
}

/* ================= MONEY SCORE ================= */

export function calculateMoneyScore(keyword = "") {

  const k = clean(keyword);

  let score = 0;

  /* ================= BUY INTENT ================= */

  const buyWords = [

    "best",
    "buy",
    "cheap",
    "deal",
    "discount",
    "review",
    "top",
    "amazon",
    "offers",
    "sale",
    "under",
    "vs",
    "comparison",

  ];

  buyWords.forEach((word) => {

    if (k.includes(word)) {
      score += 15;
    }

  });

  /* ================= HIGH VALUE CATEGORIES ================= */

  const highValue = [

    "laptop",
    "iphone",
    "smart watch",
    "headphones",
    "gaming",
    "camera",
    "tv",
    "monitor",
    "keyboard",
    "mouse",
    "airpods",
    "tablet",

  ];

  highValue.forEach((word) => {

    if (k.includes(word)) {
      score += 20;
    }

  });

  /* ================= LONG TAIL SEO ================= */

  const words =
    k.split(" ").length;

  if (words >= 3) {
    score += 10;
  }

  if (words >= 5) {
    score += 10;
  }

  /* ================= VIRAL SEO ================= */

  if (
    k.includes("viral") ||
    k.includes("tiktok") ||
    k.includes("trending")
  ) {
    score += 18;
  }

  /* ================= FINAL ================= */

  return Math.min(
    100,
    Math.round(score)
  );
}
