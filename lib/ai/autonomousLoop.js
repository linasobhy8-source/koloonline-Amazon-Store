import { marketScanner } from "./marketScanner";
import { decisionEngine } from "./decisionEngine";
import { funnelEngine } from "./funnelEngine";
import { growthHacker } from "./growthHacker";
import { adOptimizer } from "./adOptimizer";
import { profitRouter } from "./profitRouter";
import { selfEvolution } from "./selfEvolution";

/* ================= AUTONOMOUS LOOP ================= */
export async function autonomousLoop() {
  console.log("🔁 AI LOOP RUNNING");

  const market = await marketScanner();

  const decisions = await decisionEngine(market);

  const funnel = await funnelEngine(decisions);

  const traffic = await growthHacker(decisions);

  const ads = await adOptimizer(decisions);

  const profit = await profitRouter(decisions, traffic, ads);

  await selfEvolution({
    market,
    profit,
    decisions
  });

  return { status: "cycle complete" };
}
