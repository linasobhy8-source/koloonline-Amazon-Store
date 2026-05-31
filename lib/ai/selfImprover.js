/* ================= SELF IMPROVING SYSTEM ================= */
export async function selfImprover(products) {
  const avgDemand =
    products.reduce((sum, p) => sum + (p.salesVelocity || 0), 0) /
    products.length;

  const improvement = {
    mode: avgDemand > 1500 ? "AGGRESSIVE GROWTH" : "STABLE OPTIMIZATION",
    boostAI: avgDemand > 2000,
    timestamp: Date.now()
  };

  console.log("🧠 System Improved:", improvement);

  return improvement;
}
