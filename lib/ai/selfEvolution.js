export async function selfEvolution({ data, money }) {
  let evolutionScore = 0;

  if (money.score > 100) {
    evolutionScore += 10;
  }

  if (data.market?.length > 10) {
    evolutionScore += 5;
  }

  const mutation = {
    timestamp: Date.now(),
    evolutionScore,
    nextLevelReady: evolutionScore > 12,
  };

  console.log("🧬 EVOLUTION:", mutation);

  return mutation;
}
