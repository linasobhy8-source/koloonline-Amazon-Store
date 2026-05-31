export async function killSwitchEngine(portfolio) {
  const losers = portfolio.filter(p => p.score < 40);

  losers.forEach(p => {
    console.log("❌ KILLING PRODUCT:", p.id);
  });

  return losers.length;
}
