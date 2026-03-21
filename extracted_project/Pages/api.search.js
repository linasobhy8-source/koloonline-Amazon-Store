export default async function handler(req, res) {
  const { q, category = "all" } = req.query;

  const SERPAPI_KEY = process.env.SERPAPI_KEY;

  if (!q && category === "all") {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const url = `https://serpapi.com/search.json?engine=amazon&q=${encodeURIComponent(q)}&api_key=${SERPAPI_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    let products = data.organic_results || [];

    // فلترة بسيطة
    if (category === "tech") {
      products = products.filter(p =>
        p.title?.toLowerCase().includes("iphone") ||
        p.title?.toLowerCase().includes("laptop") ||
        p.title?.toLowerCase().includes("samsung")
      );
    }

    if (category === "home") {
      products = products.filter(p =>
        p.title?.toLowerCase().includes("home") ||
        p.title?.toLowerCase().includes("kitchen")
      );
    }

    const result = products.map(p => ({
      title: p.title,
      price: p.price || "N/A",
      thumbnail: p.thumbnail || ""
    }));

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
}