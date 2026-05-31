export function startAutonomousLoop() {
  setInterval(async () => {
    try {
      console.log("⚙️ Running Autonomous Revenue Engine...");
      await autonomousRevenueEngine();
    } catch (e) {
      console.error("Engine Error:", e);
    }
  }, 60000); // كل دقيقة
}
