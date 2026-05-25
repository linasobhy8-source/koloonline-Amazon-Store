export const AI_ENABLED = false;

/* ================= SAFE GUARD ================= */
export function aiGuard() {
  if (!AI_ENABLED) {
    throw new Error("🛑 AI SYSTEM DISABLED");
  }
}
