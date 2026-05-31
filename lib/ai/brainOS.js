import { autonomousLoop } from "./autonomousLoop";
import { getAdaptivePolicy, updateAdaptivePolicy } from "./policyEngine";

/* ================= LEVEL 13 REAL BRAIN ================= */

let isRunning = false;
let intervalRef = null;

export async function brainOS() {
  if (isRunning) return;

  isRunning = true;

  console.log("🧠 LEVEL 13 REAL BRAIN STARTED");

  await runCycle();

  intervalRef = setInterval(runCycle, 60000);
}

/* ================= MAIN LEARNING LOOP ================= */
async function runCycle() {
  try {
    const start = Date.now();

    /* 1️⃣ GET LIVE MARKET DATA */
    const result = await autonomousLoop();

    const products = result.market || [];

    /* 2️⃣ LOAD CURRENT POLICY */
    const policy = await getAdaptivePolicy();

    /* 3️⃣ APPLY POLICY (REAL DECISION MAKING) */
    const scored = products.map(p => {
      const base =
        (p.views || 0) * policy.weights.views +
        (p.clicks || 0) * policy.weights.clicks +
        (p.orders || 0) * policy.weights.orders;

      const conversion = p.clicks
        ? p.orders / p.clicks
        : 0;

      return {
        ...p,
        score: base + conversion * policy.weights.conversion,
      };
    });

    scored.sort((a, b) => b.score - a.score);

    const top = scored.slice(0, 10);
    const worst = scored.slice(-5);

    /* 4️⃣ AUTO LEARNING (REAL PART) */
    const newPolicy = evolvePolicy(policy, scored);

    await updateAdaptivePolicy(newPolicy);

    /* 5️⃣ ACTIONS (REAL DECISIONS) */
    console.log("🏆 TOP PRODUCT:", top[0]?.id);
    console.log("❌ WEAK PRODUCT:", worst[0]?.id);

    console.log("📊 CYCLE DONE IN:", Date.now() - start, "ms");

    return {
      top,
      worst,
      policy: newPolicy,
    };

  } catch (e) {
    console.error("❌ BRAIN ERROR:", e.message);
  }
}

/* ================= REAL POLICY EVOLUTION ================= */
function evolvePolicy(policy, products) {
  const avgClicks =
    products.reduce((a, b) => a + (b.clicks || 0), 0) / products.length;

  const avgOrders =
    products.reduce((a, b) => a + (b.orders || 0), 0) / products.length;

  const conversion = avgClicks
    ? avgOrders / avgClicks
    : 0;

  let weights = { ...policy.weights };

  // 🧠 Learning logic (REAL adaptation)
  if (conversion > 0.1) {
    weights.conversion *= 1.05;
    weights.clicks *= 1.02;
  } else {
    weights.views *= 1.03;
  }

  // normalize
  const sum =
    weights.views +
    weights.clicks +
    weights.orders +
    weights.conversion;

  Object.keys(weights).forEach(k => {
    weights[k] = weights[k] / sum;
  });

  return {
    weights,
    updatedAt: Date.now(),
    performance: {
      conversion,
      avgClicks,
      avgOrders,
    },
  };
}

/* ================= STOP ================= */
export function stopBrain() {
  clearInterval(intervalRef);
  isRunning = false;
}
