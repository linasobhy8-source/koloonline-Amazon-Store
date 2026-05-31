import { autonomousLoop } from "./autonomousLoop";

/* ================= LEVEL 11 BRAIN ================= */
export async function brainOS() {
  console.log("🧠 AI BUSINESS OS STARTED");

  while (true) {
    try {
      await autonomousLoop();
      await sleep(60000); // كل دقيقة
    } catch (e) {
      console.error("AI ERROR RECOVERED:", e);
    }
  }
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}
