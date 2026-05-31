export async function seoAutopilot(portfolio) {
  for (const p of portfolio.slice(0, 5)) {
    console.log("🔍 SEO BOOST:", p.id);

    // simulate keyword injection
    p.seoScore = (p.seoScore || 0) + 20;
  }

  return true;
}
