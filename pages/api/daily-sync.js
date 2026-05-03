export default async function handler(req, res) {
  const base = process.env.NEXT_PUBLIC_SITE_URL;

  const endpoints = [
    "/api/sync-products?q=electronics",
    "/api/sync-products?q=fashion",
    "/api/sync-products?q=deals",
    "/api/sync-products?q=home",
    "/api/ai-learning-engine",
    "/api/ai-learning-engine-deep",
    "/api/graph-ai"
  ];

  for (const endpoint of endpoints) {
    try {
      console.log("Calling:", endpoint);
      await fetch(`${base}${endpoint}`);

      // delay بسيط لتقليل الضغط
      await new Promise(r => setTimeout(r, 2000));

    } catch (e) {
      console.error("Error:", endpoint, e.message);
    }
  }

  return res.status(200).json({ success: true });
}
