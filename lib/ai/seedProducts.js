let isRunning = false;
let intervalId = null;

export function startAutonomousLoop() {
  // منع تشغيل أكثر من مرة
  if (intervalId) return;

  intervalId = setInterval(async () => {
    if (isRunning) return;

    isRunning = true;

    try {
      console.log("⚙️ Running Autonomous Revenue Engine...");

      // تأكد إن الدالة موجودة
      if (typeof autonomousRevenueEngine === "function") {
        await autonomousRevenueEngine();
      } else {
        console.warn("autonomousRevenueEngine is not defined");
      }

    } catch (e) {
      console.error("Engine Error:", e);
    } finally {
      isRunning = false;
    }
  }, 60000); // كل دقيقة
}

/* ================= OPTIONAL STOP FUNCTION ================= */
export function stopAutonomousLoop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    isRunning = false;
    console.log("🛑 Autonomous loop stopped");
  }
}
