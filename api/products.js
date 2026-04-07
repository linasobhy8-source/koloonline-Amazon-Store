export default function handler(req, res) {

  // ================= COUNTRY =================
  const country = (req.query.country || "us").toLowerCase();

  const affiliateTags = {
    us: "koloonlinesto-20",
    ca: "onlinesho0429-20",
    pl: "koloonline-21",
    eg: "onlinesh03f31-21"
  };

  // ================= DOMAIN =================
  let domain = "amazon.com";
  if (country === "eg") domain = "amazon.eg";
  if (country === "ca") domain = "amazon.ca";
  if (country === "pl") domain = "amazon.pl";

  // ================= PRODUCTS =================
  const products = [
    {
      id: 1,
      title: "🎧 سماعة Anker مكبر الصوت",
      image: "https://m.media-amazon.com/images/I/71tV4O0rO0L._AC_SL1500_.jpg",
      asin: "B07ZNT7PRL",
      rating: 4.5,
      priority: 5,
      affiliateRate: 0.08
    },
    {
      id: 2,
      title: "🔪 سكين HOSHANHO احترافي",
      image: "https://m.media-amazon.com/images/I/81pZ9n52llL._AC_SL1500_.jpg",
      asin: "B0CKMF6GPZ",
      rating: 4.2,
      priority: 4,
      affiliateRate: 0.07
    }
  ];

  // ================= ADD AFFILIATE LINK =================
  const finalProducts = products.map(p => ({
    ...p,
    link: `https://${domain}/dp/${p.asin}?tag=${affiliateTags[country]}`
  }));

  // ================= RESPONSE =================
  res.status(200).json({
    success: true,
    country,
    count: finalProducts.length,
    products: finalProducts
  });
}
