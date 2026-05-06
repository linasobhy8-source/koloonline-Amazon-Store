export function calculateMoneyScore(keyword) {
  let score = 0;

  const k = keyword.toLowerCase();

  // 🔥 Buy Intent keywords
  if (k.includes("best")) score += 30;
  if (k.includes("buy")) score += 25;
  if (k.includes("cheap")) score += 15;
  if (k.includes("review")) score += 10;
  if (k.includes("deal")) score += 20;
  if (k.includes("discount")) score += 20;

  // 💰 Product categories high value
  if (k.includes("laptop") || k.includes("smart watch")) score += 25;
  if (k.includes("headphones") || k.includes("earbuds")) score += 20;

  // ⚡ Boost long-tail keywords
  if (k.split(" ").length >= 3) score += 10;

  return score;
}
