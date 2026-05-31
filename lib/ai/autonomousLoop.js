import { decisionEngine } from "./decisionEngine";
import { autonomousRevenueEngine } from "./autonomousRevenueEngine";
import { seoAutopilot } from "./seoAutopilot";

export async function autonomousLoop() {
  const products = []; // ممكن تجيبه من Firebase لاحقًا

  const decisions = decisionEngine(products);
  const revenue = await autonomousRevenueEngine(decisions);
  const seo = await seoAutopilot(decisions);

  return {
    market: decisions,
    profit: revenue,
    seo,
  };
}
