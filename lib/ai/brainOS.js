import { autonomousLoop } from "./autonomousLoop";

/* ================= MASTER AI BRAIN (LEVEL 12) ================= */

let isRunning = false;
let intervalRef = null;

export async function brainOS() {
  if (isRunning) {
    console.log("⚠️ Brain already running");
    return;
  }

  isRunning = true;

  console.log("🧠 AI BRAIN STARTED (LEVEL 12 MODE)");

  // تشغيل أولي مباشر
  await runCycle();

  // Loop أساسي
  intervalRef = setInterval(async () => {
    await runCycle();
  }, 60000); // كل دقيقة

  // حماية من crash في السيرفر
  process.on("uncaughtException", (err) => {
    console.error("🔥 Uncaught Exception:", err.message);
  });

  process.on("unhandledRejection", (err) => {
    console.error("🔥 Unhandled Rejection:", err);
  });
}

/* ================= SINGLE CYCLE ================= */
async function runCycle() {
  const start = Date.now();

  try {
    console.log("🔁 AI CYCLE STARTED...");

    const result = await autonomousLoop();

    console.log("✅ CYCLE COMPLETE");
    console.log("📊 Products:", result.market?.length || 0);
    console.log("💰 Revenue:", result.profit?.estimatedRevenue || 0);
    console.log("📈 ROI:", result.profit?.roi || 0);
    console.log("⏱️ Time:", Date.now() - start + "ms");

    return result;

  } catch (e) {
    console.error("❌ CYCLE ERROR:", e.message);

    // Auto recovery delay
    await new Promise(r => setTimeout(r, 5000));
  }
}

/* ================= STOP FUNCTION ================= */
export function stopBrain() {
  if (intervalRef) {
    clearInterval(intervalRef);
    intervalRef = null;
  }

  isRunning = false;

  console.log("🛑 AI BRAIN STOPPED");
}
