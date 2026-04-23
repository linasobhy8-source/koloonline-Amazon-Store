export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const products = [
      {
        asin: "B09V7Z4TJG",
        title: "Smart Watch Pro",
        price: 49.99,
        image: "https://m.media-amazon.com/images/I/61IMRs+o0iL._AC_SL1500_.jpg",
        tag: "koloonlinesto-20"
      },
      {
        asin: "B0C4GPPD1H",
        title: "Fitness Tracker",
        price: 39.99,
        image: "https://m.media-amazon.com/images/I/61u48FEs0rL._AC_SL1000_.jpg",
        tag: "koloonlinesto-20"
      }
    ];

    const { asin } = req.query;

    if (asin) {
      const product = products.find(p => p.asin === asin);

      if (!product) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(200).json({ product });
    }

    return res.status(200).json({ products });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
