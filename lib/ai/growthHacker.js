/* ================= TRAFFIC GENERATOR ================= */
export async function growthHacker(decisions) {
  return {
    traffic: decisions.length * 1000,
    sources: ["tiktok", "seo", "ads"],
    viralBoost: true
  };
}
