import { autonomousLoop } from "./autonomousLoop";

/* ================= MASTER AI BRAIN (LEVEL 12++) ================= */

let isRunning = false;
let intervalRef = null;
let lastRun = 0;

const CONFIG = {
  interval: 60000,
  cycleTimeout: 55000,
  maxRetry: 3,
};

export async function brainOS() {
  if (isRunning) {
    console.log("⚠️ Brain already running");
    return;
  }

  isRunning = true;

  console.log("🧠 AI BRAIN STARTED (LEVEL 12++)");

  // أول تشغيل مباشر
  await runCycle();

  // Loop أساسي
  intervalRef = setInterval(async () => {
    await runCycle();
  }, CONFIG.interval);

  // حماية أخطاء runtime
  if (typeof process !== "undefined") {
    process.on("uncaughtException", (err) => {
      console.error("🔥 Uncaught Exception:", err.message);
    });

    process.on("unhandledRejection", (err) => {
      console.error("🔥 Unhandled Rejection:", err);
    });
  }
}

/* ================= SAFE CYCLE RUNNER ================= */
async function runCycle(retry = 0) {
  const start = Date.now();

  // منع overlap (مهم جدًا)
  if (Date.now() - lastRun < 10000 && retry === 0) {
    console.log("⏳ Skipping cycle (too soon)");
    return;
  }

  lastRun = Date.now();

  console.log("🔁 AI CYCLE STARTED...");

  try {
    const result = await runWithTimeout(
      autonomousLoop(),
      CONFIG.cycleTimeout
    );

    console.log("✅ CYCLE COMPLETE");
    console.log("📊 Products:", result?.market?.length || 0);
    console.log("💰 Revenue:", result?.profit?.estimatedRevenue || 0);
    console.log("📈 ROI:", result?.profit?.roi || 0);
    console.log("⏱️ Time:", Date.now() - start + "ms");

    return {
      success: true,
      ...result,
    };

  } catch (e) {
    console.error(`❌ CYCLE ERROR (attempt ${retry + 1}):`, e.message);

    // Retry logic
    if (retry < CONFIG.maxRetry) {
      console.log("🔄 Retrying cycle...");
      await sleep(3000);
      return runCycle(retry + 1);
    }

    return {
      success: false,
      error: e.message,
    };
  }
}

/* ================= TIMEOUT WRAPPER ================= */
function runWithTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Cycle timeout exceeded"));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/* ================= SLEEP UTILITY ================= */
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ================= STOP BRAIN ================= */
export function stopBrain() {
  if (intervalRef) {
    clearInterval(intervalRef);
    intervalRef = null;
  }

  isRunning = false;

  console.log("🛑 AI BRAIN STOPPED");
}

/* ================= HEALTH CHECK ================= */
export function brainHealth() {
  return {
    running: isRunning,
    lastRun,
    uptime: Date.now() - lastRun,
    status: isRunning ? "ACTIVE" : "STOPPED",
  };
                }
