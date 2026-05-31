import { builderEngine } from "./builderEngine";
import { marketingAgent } from "./marketingAgent";
import { pricingAgent } from "./pricingAgent";

/* ================= EXECUTION ENGINE ================= */
export async function executionEngine(plan) {
  console.log("⚙️ EXECUTING AI PLAN...");

  // 🧱 بناء منتجات أو صفحات جديدة
  if (plan.decisions?.length > 0) {
    await builderEngine(plan.decisions);
  }

  // 📣 تسويق تلقائي
  if (plan.traffic) {
    await marketingAgent(plan.traffic);
  }

  // 💰 تعديل الأسعار
  if (plan.decisions) {
    await pricingAgent(plan.decisions);
  }

  return true;
}
