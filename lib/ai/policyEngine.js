export function policyEngine(state = {}) {
  if (!state) return false;

  if (state.errors > 3) return false;
  if (state.revenue?.estimatedRevenue > 10000) return false;
  if (state.loopCount > 100) return false;

  return true;
}
