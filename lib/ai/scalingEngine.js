export async function scalingEngine(portfolio) {
  const winners = portfolio.filter(p => p.score > 80);

  winners.forEach(p => {
    console.log("🚀 SCALING PRODUCT:", p.id);
  });

  return winners.length;
}
