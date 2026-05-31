export async function adController(portfolio) {
  const adsBudget = portfolio.length * 20;

  return {
    totalBudget: adsBudget,
    platforms: ["meta", "google", "tiktok"],
    allocation: portfolio.map(p => ({
      id: p.id,
      spend: p.score > 80 ? 50 : 10
    }))
  };
}
