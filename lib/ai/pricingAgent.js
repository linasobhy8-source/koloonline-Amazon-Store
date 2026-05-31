/* ================= PRICING AGENT ================= */
export async function pricingAgent(decisions) {
  return decisions.map(p => {
    let newPrice = p.price || 10;

    if (p.demand > 0.8) newPrice *= 1.2;
    if (p.demand < 0.3) newPrice *= 0.9;

    console.log("💰 PRICE UPDATED:", p.id, newPrice);

    return {
      ...p,
      newPrice
    };
  });
}
