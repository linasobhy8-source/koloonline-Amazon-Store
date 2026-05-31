import { autonomousLoop } from "./autonomousLoop";

let isRunning = false;
let intervalRef = null;

export async function brainOS() {
  if (isRunning) return;

  isRunning = true;

  console.log("🧠 LEVEL 20 BRAIN STARTED");

  await runCycle();

  intervalRef = setInterval(runCycle, 60000);

  process.on("uncaughtException", (e) => {
    console.error("CRASH:", e.message);
  });

  process.on("unhandledRejection", (e) => {
    console.error("REJECTION:", e);
  });
}

async function runCycle() {
  try {
    await autonomousLoop();
  } catch (e) {
    console.error("CYCLE ERROR:", e.message);
  }
}

export function stopBrain() {
  clearInterval(intervalRef);
  isRunning = false;
}
