import { autonomousLoop } from "./autonomousLoop";
import { moneyLoop } from "./moneyLoop";
import { selfEvolution } from "./selfEvolution";

export async function brainOS() {
  console.log("🧠 LEVEL 15 MONEY FACTORY ACTIVE");

  setInterval(async () => {
    try {
      const data = await autonomousLoop();

      /* 💰 NEW: MONEY CREATION LAYER */
      const money = await moneyLoop(data);

      /* 🧬 SELF EVOLUTION */
      await selfEvolution({
        data,
        money,
      });

      console.log("🚀 MONEY CYCLE COMPLETE");
      console.log("💰 Revenue Score:", money.score);

    } catch (e) {
      console.error("🔥 BRAIN FAILURE RECOVERED:", e.message);
    }
  }, 45000);
}
