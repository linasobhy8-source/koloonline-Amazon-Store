import { marketScanner } from "./marketScanner";
import { decisionEngine } from "./decisionEngine";
import { funnelEngine } from "./funnelEngine";
import { growthHacker } from "./growthHacker";
import { adOptimizer } from "./adOptimizer";
import { profitRouter } from "./profitRouter";
import { selfEvolution } from "./selfEvolution";

/* ================= MAIN LOOP ================= */
export async function autonomousLoop() {
  const market = await marketScanner();

  const decisions = await decisionEngine(market);

  const funnel = await funnelEngine(decisions);

  const traffic = await growthHacker(decisions);

  const ads = await adOptimizer(decisions);

  const profit = await profitRouter(decisions, traffic, ads);

  const evolution = await selfEvolution({ profit });

  return {
    market,
    decisions,
    funnel,
    traffic,
    ads,
    profit,
    evolution,
  };
}
