/* ================= FUNNEL ENGINE ================= */
export async function funnelEngine(decisions) {
  return decisions.map(d => ({
    ...d,
    funnel: d.action === "SCALE"
      ? "direct-buy funnel"
      : "content-to-buy funnel"
  }));
}
