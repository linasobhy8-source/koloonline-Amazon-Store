export default function handler(req, res) {

  const products = [
    {
      id: 1,
      asin: "B09V7Z4TJG",
      title: "Smart Watch Pro",
      price: 39.99,
      image: "https://m.media-amazon.com/images/I/61IMRs+o0iL._AC_SL1500_.jpg",
      link: "https://www.amazon.eg/dp/B09V7Z4TJG?tag=onlinesh03f31-21",
      category: "electronics",
      affiliateRate: 0.06,
      rating: 4.5,
      priority: 10
    },
    {
      id: 2,
      asin: "B07ZNT7PRL",
      title: "Anker Bluetooth Speaker",
      price: 49.99,
      image: "https://m.media-amazon.com/images/I/71tV4O0rO0L._AC_SL1500_.jpg",
      link: "https://www.amazon.eg/dp/B07ZNT7PRL?tag=onlinesh03f31-21",
      category: "audio",
      affiliateRate: 0.07,
      rating: 4.7,
      priority: 9
    },
    {
      id: 3,
      asin: "B08N5WRWNW",
      title: "Echo Dot (Smart Speaker)",
      price: 29.99,
      image: "https://m.media-amazon.com/images/I/71d5l8Zg2cL._AC_SL1500_.jpg",
      link: "https://www.amazon.eg/dp/B08N5WRWNW?tag=onlinesh03f31-21",
      category: "smart-home",
      affiliateRate: 0.08,
      rating: 4.6,
      priority: 8
    }
  ];

  // ================= SORT BY PROFIT POTENTIAL =================
  const sorted = products.sort((a, b) => {

    const scoreA = (a.affiliateRate * 100) + (a.rating * 10) + a.priority;
    const scoreB = (b.affiliateRate * 100) + (b.rating * 10) + b.priority;

    return scoreB - scoreA;
  });

  // ================= RESPONSE =================
  res.status(200).json({
    success: true,
    total: sorted.length,
    products: sorted
  });
    }
