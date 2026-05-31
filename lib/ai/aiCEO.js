import { autonomousLoop } from "./autonomousLoop";
import { executionEngine } from "./executionEngine";

/* ================= AI CEO ================= */
export async function aiCEO() {
  console.log("👑 AI CEO STARTED (LEVEL 12)");

  setInterval(async () => {
    try {
      const plan = await autonomousLoop();

      // 🧠 تحويل التحليل إلى تنفيذ حقيقي
      await executionEngine(plan);

      console.log("✅ CEO CYCLE DONE");
    } catch (e) {
      console.error("CEO ERROR:", e.message);
    }
  }, 60000);
}
