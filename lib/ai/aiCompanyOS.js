import { autonomousLoop } from "./autonomousLoop";
import { portfolioManager } from "./portfolioManager";
import { adController } from "./adController";
import { seoAutopilot } from "./seoAutopilot";
import { competitorScanner } from "./competitorScanner";
import { killSwitchEngine } from "./killSwitchEngine";
import { scalingEngine } from "./scalingEngine";

/* ================= LEVEL 13 AI COMPANY OS ================= */

export async function aiCompanyOS() {
  console.log("👑 AI COMPANY OS STARTED (LEVEL 13)");

  setInterval(async () => {
    try {
      /* 1️⃣ MARKET ANALYSIS */
      const market = await autonomousLoop();

      /* 2️⃣ COMPETITOR INTELLIGENCE */
      const competitors = await competitorScanner();

      /* 3️⃣ PORTFOLIO UPDATE */
      const portfolio = await portfolioManager(market, competitors);

      /* 4️⃣ AD CONTROL */
      const ads = await adController(portfolio);

      /* 5️⃣ SEO AUTOPILOT */
      await seoAutopilot(portfolio);

      /* 6️⃣ KILL LOSERS */
      await killSwitchEngine(portfolio);

      /* 7️⃣ SCALE WINNERS */
      await scalingEngine(portfolio);

      console.log("🔁 COMPANY CYCLE COMPLETE");

    } catch (e) {
      console.error("❌ COMPANY OS ERROR:", e.message);
    }
  }, 60000);
}
