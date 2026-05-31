import { autonomousLoop } from "./autonomousLoop";

/* ================= MASTER AI BRAIN ================= */
export async function brainOS() {
  console.log("🧠 AI BRAIN IS NOW ACTIVE");

  setInterval(async () => {
    try {
      const result = await autonomousLoop();

      console.log("🔁 CYCLE DONE");
      console.log("💰 PROFIT:", result.profit?.estimatedRevenue || 0);

    } catch (e) {
      console.error("AI ERROR RECOVERED:", e.message);
    }
  }, 60000); // كل دقيقة
}
