/* ================= ADS AI ================= */
export async function adOptimizer(decisions) {
  return decisions.map(d => ({
    niche: d.niche,
    bid: d.budget * 1.2,
    platform: "meta + google + tiktok",
    optimized: true
  }));
}
