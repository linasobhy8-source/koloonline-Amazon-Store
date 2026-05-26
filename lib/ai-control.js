export function aiGuard() {

  if (process.env.AI_MODE !== "true") {

    throw new Error("AI Engines Disabled");

  }

  return true;
}
